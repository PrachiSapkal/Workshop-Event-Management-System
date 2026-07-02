using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Data
{
   
        public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
            
            public DbSet<User> Users { get; set; }
            public DbSet<Booking> Bookings { get; set; }
            public DbSet<Feedback> Feedbacks { get; set; }
            public DbSet<WorkshopEvent> WorkshopEvents { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
 
            // Explicitly configure Feedback → User relationship
            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany() // or .WithMany(u => u.Feedbacks) if you have a collection in User
                .HasForeignKey(f => f.UserId);
                // .OnDelete(DeleteBehavior.Cascade); // optional
        }
        }


    }

