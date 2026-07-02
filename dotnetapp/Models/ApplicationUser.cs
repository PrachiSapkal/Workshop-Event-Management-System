using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;


namespace dotnetapp.Models
{
    public class ApplicationUser:IdentityUser
    {   
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50,ErrorMessage="Name cannot be longer than 50 characters.")]
        public string Name{get;set;}
    }
}
