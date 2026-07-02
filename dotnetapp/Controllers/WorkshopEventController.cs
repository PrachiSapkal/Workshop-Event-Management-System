using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Services;
using dotnetapp.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace dotnetapp.Controllers
{
    [Authorize]
    [ApiController]

    [Route("api/workshop-event")]

    public class WorkshopEventController : ControllerBase
    {
        private readonly WorkshopEventService _workshopEventService;

        public WorkshopEventController(WorkshopEventService workshopEventService)
        {
            _workshopEventService = workshopEventService;
        }

        
        //if any error related to get all workshop check this api url both in swagger and in method
         
       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkshopEvent>>> GetAllWorkshopEvents()
        {
            try
            {
                var events = await _workshopEventService.GetAllWorkshopEvents();
                //return Ok(new { message = "Successfully fetched all workshop events.", data = events });
                return Ok(events);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }



        [HttpGet("{workshopEventId}")]
        public async Task<ActionResult<WorkshopEvent>> GetWorkshopEventById(int workshopEventId)
        {
            try
            {
                var workshopEvent = await _workshopEventService.GetWorkshopEventById(workshopEventId);
                if (workshopEvent == null)
                    //return NotFound(new { message = "Workshop event not found." });
                    return Ok(new string[] {});

                return Ok(new { message = "Successfully fetched the workshop event.", data = workshopEvent });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddWorkshopEvent([FromBody] WorkshopEvent workshopEvent)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid workshop event data." });

                var result = await _workshopEventService.AddWorkshopEvent(workshopEvent);
                if (result)
                    return Ok(new { message = "Workshop event added successfully." });

                return StatusCode(500, new { message = "Failed to add workshop event." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{workshopEventId}")]
        public async Task<ActionResult> UpdateWorkshopEvent(int workshopEventId, [FromBody] WorkshopEvent workshopEvent)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid workshop event data." });

                var result = await _workshopEventService.UpdateWorkshopEvent(workshopEventId, workshopEvent);
                if (result)
                    return Ok(new { message = "Workshop event updated successfully." });

                return NotFound(new { message = "Workshop event not found." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{workshopEventId}")]
        public async Task<ActionResult> DeleteWorkshopEvent(int workshopEventId)
        {
            try
            {
                var result = await _workshopEventService.DeleteWorkshopEvent(workshopEventId);
                if (result)
                    return Ok(new { message = "Workshop event deleted successfully." });

                return NotFound(new { message = "Workshop event not found or is referenced in bookings." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // [HttpGet("organizer/{organizerName}")]
        // public async Task<ActionResult<IEnumerable<WorkshopEvent>>> GetEventsByOrganizer(string organizerName)
        // {
        //     try
        //     {
        //         var events = await _workshopEventService.GetEventsByOrganizer(organizerName);
        //         if (events == null || !events.Any())
        //             return NotFound(new { message = "No events found for this organizer." });

        //         return Ok(new { message = "Successfully fetched events.", data = events });
        //     }
        //     catch (System.Exception ex)
        //     {
        //         return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
        //     }
        // }
    }
}
