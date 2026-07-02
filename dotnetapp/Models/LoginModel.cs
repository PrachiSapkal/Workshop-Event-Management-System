using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;


namespace dotnetapp.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email is required")]
	    [EmailAddress(ErrorMessage = "Email Address should be valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}