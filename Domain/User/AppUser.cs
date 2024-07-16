using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Domain.Interfaces;

namespace Domain.User
{
	public class AppUser : IdentityUser<Guid>, IPeople, IChangeTrackingCreate, IChangeTrackingUpdate, IChangeTrackingDelete
	{

		public string Title { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		
		public bool ForcePasswordReset { get; set; }
		public DateTime CreatedDate { get; set; }  = DateTime.UtcNow;
		public string CreatedBy { get; set; }
		public DateTime? UpdatedDate { get; set; } = DateTime.UtcNow;
		public string UpdatedBy { get; set; } 

		public bool IsActive { get; set; }
		public bool IsInternal {get; set;} = false;
		public string ReferenceNotes { get; set; }
		public bool IsDeleted { get; set; } = false;
		public string DeletedBy { get; set; }
		public DateTime? DeletedDate { get; set; }
		
		public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
		public ICollection<ResetPassword> ResetPasswords {get; set;} = new List<ResetPassword>();
	}
}