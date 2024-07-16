using System;

namespace Api.DTOs
{
	public class UserDto
	{
		public string Token { get; set; }
		public Guid Id { get; set; }
		public string Email { get; set; }
		public string Username { get; set; }
		public Guid ClientId {get; set;}
		public string FirstName {get; set;}
		public string LastName {get; set;}
	}
}