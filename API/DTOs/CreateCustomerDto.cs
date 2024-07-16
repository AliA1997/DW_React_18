using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Http;

namespace Api.DTOs
{

    public class CreateCustomerDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [EmailAddress]
        [Required]
        public string Email { get; set; }

        [Required]
        [RegularExpression("^(\\(\\d{3}\\)[\\s.-]?|\\d{3}[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}$")]
        public string PhoneNumber { get; set; }

        public DateTime Birthdate { get; set; }

        public string FavoriteColor { get; set; }

        public string? Photo { get; set; }
    }
}