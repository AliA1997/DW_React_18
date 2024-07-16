using System;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class RefreshToken
    {
        [Required, Key]
        public int Id { get; set; }
        public User.AppUser AppUser { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}