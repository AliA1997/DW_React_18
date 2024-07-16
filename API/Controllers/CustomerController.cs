using System;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Api.DTOs;
using API.Services;
using Application.Core;
using Application.Customers;
using Domain;
using Domain.User;
using Infrastructure.Email;
using MediatR;
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
	public class CustomerController : BaseApiController
	{
		private readonly IMediator _mediator;
		private readonly HttpClient _httpClient;

		public CustomerController(IMediator mediator)
		{
			_mediator = mediator;
			_httpClient = new HttpClient
			{
				BaseAddress = new System.Uri("https://graph.facebook.com")
			};
		}


        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PagedList<Customer, CustomerDetails>>> ReadCustomerDetails([FromQuery] PagingParams pParams)
        {
            var command = new ReadCustomer.Command { GetCustomerDetailsParams = pParams };
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            else
            {
                return BadRequest("Unsuccessfully got customers.");
            }
        }


        [AllowAnonymous]
        [HttpGet("health")]
        public ActionResult<string> HealthCheck()
        {
            return Ok("It's Healthy!");
        }


        [AllowAnonymous]
        [HttpGet("{customerId}")]
        public async Task<ActionResult<CustomerDetails>> ReadCustomerDetailsById(string customerId)
        {
            var command = new ReadCustomerById.Command { Id = customerId };
            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            else
            {
                return BadRequest("Unsuccessfully got customers.");
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] CreateCustomerDto dto)
        {
            var command = new AddCustomer.Command
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Birthdate = dto.Birthdate,
                FavoriteColor = dto.FavoriteColor,
                Photo = dto.Photo
            };

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            else
            {
                return BadRequest("Unsuccessfully got customers.");
            }
        }

		[AllowAnonymous]
		[HttpDelete("{customerId}")]
		public async Task<ActionResult> DeleteCustomer(string customerId)
		{
			var command = new DeleteCustomer.Command { Id = customerId };

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return NoContent();
            }
            else
            {
                return BadRequest("Unsuccessfully delete customer.");
            }

        }

        [AllowAnonymous]
        [HttpPut("{customerId}")]
        public async Task<ActionResult<Customer>> UpdateCustomer(string customerId, [FromBody] UpdateCustomerDto dto)
        {
            var command = new UpdateCustomer.Command
            {  
               Id = customerId,
            };
            if (!string.IsNullOrWhiteSpace(dto.FirstName))
                command.FirstName = dto.FirstName;
            if (!string.IsNullOrWhiteSpace(dto.LastName))
                command.LastName = dto.LastName;
            if (!string.IsNullOrWhiteSpace(dto.Email))
                command.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
                command.PhoneNumber = dto.PhoneNumber;
            if (!string.IsNullOrWhiteSpace(dto.FavoriteColor))
                command.FavoriteColor = dto.FavoriteColor;
            if (dto.Photo != null)
                command.Photo = dto.Photo;
            if (dto.Birthdate != null)
                command.Birthdate = dto.Birthdate;

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            else
            {
                return BadRequest("Unsuccessfully delete customer.");
            }

        }


	}
}