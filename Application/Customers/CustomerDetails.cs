using Domain;
using System;

namespace Application.Customers
{
    public class CustomerDetails
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Birthday { get; set; }
        public int Age { get; set; }
        public string FavoriteColor { get; set; }
        public string Avatar { get; set; }
    }
}
