using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using dotnetapp.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.StaticFiles;

namespace dotnetapp.Controllers
{
    [Authorize]
    //[ApiController]
    [Route("api/booking")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        // Constructor
        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // Retrieve all bookings (Admin only)
        [HttpGet("/api/bookings")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookings();
                return Ok(bookings);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Retrieve bookings by user ID (User only)
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByUserId(int userId)
        {
            try
            {
                var bookings = await _bookingService.GetBookingsByUserId(userId);
                if (bookings == null || !bookings.Any())
                {
                    //return NotFound("Booking not found");
                    return Ok(new string[] { });
                }
                return Ok(bookings);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Add a new booking (User only)
        [Authorize(Roles = "User")]
        [HttpPost]
        
        public async Task<ActionResult> AddBooking([FromBody] Booking booking)
        {
if (!ModelState.IsValid)
{
    var errors = ModelState
        .Where(ms => ms.Value.Errors.Count > 0)
        .Select(ms => new
        {
            Field = ms.Key,
            Errors = ms.Value.Errors.Select(e => e.ErrorMessage).ToArray()
        });

    // Example: Logging the errors
    foreach (var error in errors)
    {
        Console.WriteLine($"Field: {error.Field}");
        foreach (var err in error.Errors)
        {
            Console.WriteLine($"  Error: {err}");
        }
    }
    return BadRequest(errors);
}
Console.WriteLine(booking);

            try
            {
                var result = await _bookingService.AddBooking(booking);
                if (result)
                {
                    return Ok();
                }
                return StatusCode(500, "Failed to add booking");
            }
            catch (WorkshopEventException ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Update an existing booking (Admin only)
        [HttpPut("{bookingId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateBooking(int bookingId, [FromBody] Booking booking)
        {
            try
            {
                var result = await _bookingService.UpdateBooking(bookingId, booking);
                if (!result)
                {
                    return NotFound("Booking not found");
                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Delete a booking (Admin or User)
        [HttpDelete("{bookingId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult> DeleteBooking(int bookingId)
        {
            try
            {
                var result = await _bookingService.DeleteBooking(bookingId);
                if (!result)
                {
                    return NotFound("Booking not found");
                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    
[HttpPost("upload")]
[Authorize(Roles = "Admin,User")]
public async Task<IActionResult> UploadFile(IFormFile file)
{
    // if(!ModelState.IsValid){
    //     return BadRequest(File(fileBytes, "application/octet-stream", fileName));
    // }
    if (file == null || file.Length == 0)
        return BadRequest("No file uploaded.");

var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles");

if (!Directory.Exists(uploadPath))
{
    Directory.CreateDirectory(uploadPath);
}

var filePath = Path.Combine(uploadPath, file.FileName);


    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    return Ok(new { filePath = filePath });
}

// [HttpGet("view/{fileName}")]
// [Authorize(Roles = "Admin,User")]
// public IActionResult DownloadFile(string fileName)
// {
//     //var path = Path.Combine("UploadedFiles", fileName);
//     var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles");
// if (!Directory.Exists(uploadPath))
// {
//     Directory.CreateDirectory(uploadPath);
// }

// var filePath = Path.Combine(uploadPath, fileName);
//     if (!System.IO.File.Exists(filePath))
//         return NotFound();
//     var fileBytes = System.IO.File.ReadAllBytes(filePath);
    
//     var contentDisposition = new System.Net.Mime.ContentDisposition
//     {
//         Inline = true,
//         FileName = fileName
//     };

//     Response.Headers.Add("Content-Disposition", contentDisposition.ToString());

//     return File(fileBytes, "application/octet-stream", fileName);
// }

// [HttpGet("view/{fileName}")]
// [Authorize(Roles = "Admin,User")]
// public IActionResult ViewFile(string fileName)
// {
//     var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles");

//     if (!Directory.Exists(uploadPath))
//     {
//         Directory.CreateDirectory(uploadPath);
//     }

//     var filePath = Path.Combine(uploadPath, fileName);

//     if (!System.IO.File.Exists(filePath))
//         return NotFound();

//     var fileBytes = System.IO.File.ReadAllBytes(filePath);

//     // Set correct MIME type based on file extension
//     var contentType = "application/pdf"; // You can make this dynamic if needed

//     Response.Headers.Add("Content-Disposition", $"inline; filename=\"{fileName}\"");

//     return File(fileBytes, contentType); // ✅ No third parameter
// }



[HttpGet("view/{fileName}")]
[Authorize(Roles = "Admin,User")]
public IActionResult ViewFile(string fileName)
{
    var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles");

    if (!Directory.Exists(uploadPath))
    {
        Directory.CreateDirectory(uploadPath);
    }

    var filePath = Path.Combine(uploadPath, fileName);

    if (!System.IO.File.Exists(filePath))
        return NotFound();

    var fileBytes = System.IO.File.ReadAllBytes(filePath);

    // Dynamically determine MIME type
    var provider = new FileExtensionContentTypeProvider();
    if (!provider.TryGetContentType(fileName, out string contentType))
    {
        contentType = "application/octet-stream"; // fallback
    }

    Response.Headers.Add("Content-Disposition", $"inline; filename=\"{fileName}\"");

    return File(fileBytes, contentType);
}



    }
}
