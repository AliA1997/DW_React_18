using System;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Api.DTOs;
using API.Services;
using Domain.User;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace API.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		private readonly TokenService _tokenService;
		private readonly IConfiguration _config;
		private readonly HttpClient _httpClient;
		private readonly EmailSender _emailSender;
		
		public AccountController(UserManager<AppUser> userManager,
			SignInManager<AppUser> signInManager, TokenService tokenService,
			IConfiguration config, EmailSender emailSender)
		{
			_emailSender = emailSender;
			_config = config;
			_tokenService = tokenService;
			_signInManager = signInManager;
			_userManager = userManager;
			_httpClient = new HttpClient
			{
				BaseAddress = new System.Uri("https://graph.facebook.com")
			};
		}

		[AllowAnonymous]
		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = await _userManager.Users//.Include(p => p.Photos)
				.FirstOrDefaultAsync(x => x.Email.ToLower() == loginDto.Login.ToLower()  || x.UserName.ToLower() == loginDto.Login.ToLower());

			if (user == null) return Unauthorized("invalid_login");

			if (!user.EmailConfirmed) return Unauthorized("invalid_login");

			var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

			if (result.Succeeded)
			{

				await SetRefreshToken(user);
				return CreateUserObject(user);
			}

			return Unauthorized("invalid_login");
		}


		[AllowAnonymous]
		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			bool isValid = true;
			if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
			{
				ModelState.AddModelError("email", "email_taken");
				isValid = false;
			}
			if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
			{
				ModelState.AddModelError("username", "username_taken");
				isValid = false;
			}

			var user = new AppUser
			{
				Id = Guid.NewGuid(),
				Email = registerDto.Email,
				UserName = registerDto.Username,
				FirstName = registerDto.FirstName,
				LastName = registerDto.LastName,
				PhoneNumber = registerDto.PhoneNumber,
				EmailConfirmed = true,
				IsInternal = registerDto.IsInternal,
				IsActive = registerDto.IsInternal,
				LockoutEnabled = !registerDto.IsInternal
			};

			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded) return BadRequest("registration_error");
			//add role
			result =  await _userManager.AddToRolesAsync(user, registerDto.Application);
			if (!result.Succeeded) return BadRequest("role_add_error");

			//Not validating email internally
			//var origin = Request.Headers["origin"];
			//var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
			//token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

			//var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
			//var message = $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

			//await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

			return Ok("registration.sucess");
		}

		[HttpPost("changepassword")]
		[Authorize]
		public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto){
			var user = await _userManager.FindByIdAsync(changePasswordDto.Id.ToString());
			if (user == null) return Unauthorized();
			var loggedinuser = user.Id == Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
				//await _userManager.Users//.Include(p => p.Photos)
				//.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.NameIdentifier));

			if (!loggedinuser) return BadRequest("User Not own User");

			if ( changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword || changePasswordDto.NewPassword == changePasswordDto.CurrentPassword ) return BadRequest("InvalidNewPassword");
				//NOW we can change password
			var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
			
			if (!result.Succeeded) return BadRequest(result.Errors);

			return Ok("password_Updated");

		}


		[AllowAnonymous]
		[HttpPost("verifyEmail")]
		public async Task<IActionResult> VerifyEmail(string token, string email)
		{
			var user = await _userManager.FindByEmailAsync(email);
			if (user == null) return Unauthorized();
			var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
			var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
			var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

			if (!result.Succeeded) return BadRequest("Could not verify email address");

			return Ok("Email confirmed - you can now login");
		}

		[AllowAnonymous]
		[HttpGet("resendEmailConfirmationLink")]
		public async Task<IActionResult> ResendEmailConfirmationLink(string email)
		{
			var user = await _userManager.FindByEmailAsync(email);

			if (user == null) return Unauthorized();

			var origin = Request.Headers["origin"];
			var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
			token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

			var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
			var message = $"<p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

			await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

			return Ok("Email verification link resent");
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<ActionResult<UserDto>> GetCurrentUser()
		{
			var user = await _userManager.Users//.Include(p => p.Photos)
				.FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
			if (user == null) return StatusCode(401, "invalid_token");

			await SetRefreshToken(user);
			return CreateUserObject(user);
		}

		[AllowAnonymous]
		[HttpPost("fbLogin")]
		public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
		{
			var fbVerifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];

			var verifyToken = await _httpClient
				.GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifyKeys}");

			if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

			var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

			var response = await _httpClient.GetAsync(fbUrl);

			if (!response.IsSuccessStatusCode) return Unauthorized();

			var fbInfo = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

			var username = (string)fbInfo.id;

			var user = await _userManager.Users//.Include(p => p.Photos)
				.FirstOrDefaultAsync(x => x.UserName == username);

			if (user != null) return CreateUserObject(user);

			user = new AppUser
			{
				//DisplayName = (string)fbInfo.name,
				Email = (string)fbInfo.email,
				UserName = (string)fbInfo.id,
				//     Photos = new List<Photo>
				// {
				//     new Photo
				//     {
				//         Id = "fb_" + (string)fbInfo.id,
				//         Url = (string)fbInfo.picture.data.url,
				//         IsMain = true
				//     }}
			};

			user.EmailConfirmed = true;

			var result = await _userManager.CreateAsync(user);

			if (!result.Succeeded) return BadRequest("Problem creating user account");

			await SetRefreshToken(user);
			return CreateUserObject(user);
		}

		[AllowAnonymous]
		[HttpPost("refreshToken")]
		public async Task<ActionResult<UserDto>> RefreshToken()
		{
			var refreshToken = Request.Cookies["refreshToken"];
			var user = await _userManager.Users
				.Include(r => r.RefreshTokens)
				//.Include(p => p.Photos)
				.FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

			if (user == null) return Unauthorized();

			var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

			if (oldToken != null && !oldToken.IsActive) return Unauthorized();

			return CreateUserObject(user);
		}

		private async Task SetRefreshToken(AppUser user)
		{
			var refreshToken = _tokenService.GenerateRefreshToken();

			user.RefreshTokens.Add(refreshToken);
			await _userManager.UpdateAsync(user);

			var cookieOptions = new CookieOptions
			{
				HttpOnly = true,
				Expires = DateTime.UtcNow.AddDays(7)
			};

			Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
		}

		private UserDto CreateUserObject(AppUser user)
		{
			return new UserDto
			{
				//Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
				Token = _tokenService.CreateToken(user),
				Id = user.Id,
				Email = user.Email,
				Username = user.UserName,
				FirstName = user.FirstName,
				LastName = user.LastName
				
			};
		}
	}
}