using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Http;

namespace Api.DTOs
{
    //TODO get the items for Registration when creating a company and other items.
    public class UpdateCustomerDto
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public DateTime? Birthdate { get; set; }
        
        public string? FavoriteColor { get; set; }
        
        public string? Photo { get; set; }
    }
}