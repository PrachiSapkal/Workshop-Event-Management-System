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
    public class Feedback
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeedbackId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        // [JsonIgnore]
        public User? User { get; set; }

        [Required(ErrorMessage = "FeedbackText is required")]
        public string FeedbackText { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }
    }
}
