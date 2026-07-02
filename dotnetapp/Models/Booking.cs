using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace dotnetapp.Models
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        [ForeignKey("WorkshopEvent")]
        public int WorkshopEventId { get; set; }

        [JsonIgnore]
        public WorkshopEvent? WorkshopEvent { get; set; }

        [Required(ErrorMessage = "Booking Status is required")]
        public string BookingStatus { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.DateTime)]
        public DateTime BookingDate { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Age is required")]

        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Occupation is required")]
        public string Occupation { get; set; }

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "Proof is required")]
        public string Proof { get; set; }

        public string? AdditionalNotes { get; set; }
        

    }
}

