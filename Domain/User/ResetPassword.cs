using Domain.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.User
{
    public class ResetPassword : IChangeTrackingCreate
    {
        [Required, Key]
        public Guid UserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid Token { get; set; }
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddHours(12);

        public bool IsExpired => DateTime.UtcNow >= Expires;
		public DateTime CreatedDate { get; set; }  = DateTime.UtcNow;
        public string CreatedBy { get; set; }
    }
}