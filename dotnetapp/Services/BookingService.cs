using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class BookingService
    {
        private readonly ApplicationDbContext _context;

        // Constructor
        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieve all bookings
        public async Task<IEnumerable<Booking>> GetAllBookings()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkshopEvent)
                .ToListAsync();
        }

        // Retrieve bookings by user ID
        public async Task<IEnumerable<Booking>> GetBookingsByUserId(int userId)
        {
            return await _context.Bookings
                .Include(b => b.WorkshopEvent)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        // Add a new booking
        public async Task<bool> AddBooking(Booking booking)
        {
            var workshopEvent = await _context.WorkshopEvents.FindAsync(booking.WorkshopEventId);
            if (workshopEvent == null)
            {
                throw new WorkshopEventException("Workshop event not found.");
            }

            if (workshopEvent.Capacity <= 0)
            {
                throw new WorkshopEventException("No more seats available for this event.");
            }

            bool bookingExists = await _context.Bookings.AnyAsync(b =>
                b.WorkshopEventId == booking.WorkshopEventId && b.UserId == booking.UserId);

            if (bookingExists)
            {
                throw new WorkshopEventException("Booking with the same reference already exists.");
            }

            _context.Bookings.Add(booking);
            workshopEvent.Capacity -= 1;
            await _context.SaveChangesAsync();
            return true;
        }

        // Update an existing booking
        public async Task<bool> UpdateBooking(int bookingId, Booking booking)
        {
            var existingBooking = await _context.Bookings.FindAsync(bookingId);
            var workshopEvent = await _context.WorkshopEvents.FindAsync(existingBooking.WorkshopEventId);
            if (existingBooking == null)
            {
                return false;
            }

            if(booking.BookingStatus=="Rejected" || booking.BookingStatus=="rejected"){
                workshopEvent.Capacity+=1;
            }
            existingBooking.BookingStatus = booking.BookingStatus;
            existingBooking.BookingDate = booking.BookingDate;
            existingBooking.Gender = booking.Gender;
            existingBooking.Age = booking.Age;
            existingBooking.Occupation = booking.Occupation;
            existingBooking.City = booking.City;
            existingBooking.Proof = booking.Proof;
            existingBooking.AdditionalNotes = booking.AdditionalNotes;

            await _context.SaveChangesAsync();
            return true;
        }

        // Delete a booking
        public async Task<bool> DeleteBooking(int bookingId)
        {
            var bookingToDelete = await _context.Bookings.FindAsync(bookingId);
            var workshopEvent = await _context.WorkshopEvents.FindAsync(bookingToDelete.WorkshopEventId);
            if (bookingToDelete == null)
            {
                return false;
            }

            _context.Bookings.Remove(bookingToDelete);
            workshopEvent.Capacity+=1;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
