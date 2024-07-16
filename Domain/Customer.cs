using System;

namespace Domain
{
    public class Customer
    {
        public Guid Id { get; set; } 
        public string FirstName { get; set; }
        // Required Field
        public string LastName { get; set; }
        public int Age { get; set; }
        // Distinct Field
        public string Email { get; set; }
        // Required Field
        public string PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public string FavoriteColor { get; set; }
        public string Avatar { get; set; }
    }
}
