using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace Api.DTOs
{
    //TODO get the items for Registration when creating a company and other items.
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        [RegularExpression("^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$", ErrorMessage = "registration.invalid_Email")]
        public string Email { get; set; }

        [Required]
        [RegularExpression("^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$", ErrorMessage = "registration.invalid_UserName")]
        public string Username { get; set; }

        [Required]
        [RegularExpression("^(?=[^\\d_].*\\d)(?=.*[a-z])(?=.*[A-Z])(?!@#$%.*\\s).{8,50}$", ErrorMessage = "registration.invalid_Password")]
        public string Password { get; set; }

        [Required]
        [RegularExpression("^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$", ErrorMessage = "registration.invalid_PhoneNumber")]
        public string PhoneNumber { get; set; }

        [Required]
        //[RegularExpression("/^[a-zA-Z]+$/i", ErrorMessage = "Application may only contain letters")]
        public List<string> Application { get; set; }

        [Required]
        [RegularExpression("^([a-zA-Z.'-,]).{1,50}$", ErrorMessage = "registration.invalid_FirstName")]
        public string FirstName { get; set; }

        [Required]
        [RegularExpression("^([a-zA-Z.'-,]).{1,50}$", ErrorMessage = "registration.invalid_LastName")]
        public string LastName { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string FavoriteColor { get; set; }

        [Required]
        public string PhotoUrl { get; set; }

        public bool IsInternal { get; set; } = false;
        public string ClientId { get; set; }

    }
}