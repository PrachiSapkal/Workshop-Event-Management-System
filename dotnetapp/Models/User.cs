
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage =" Email Address should be valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mobile Number is required")]
        [Phone(ErrorMessage = "Mobile number should be valid")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "User Role is required")]
        public string UserRole { get; set; }   // Admin or User --- Refer

        public string? SecretKey { get; set; }
    }
}
