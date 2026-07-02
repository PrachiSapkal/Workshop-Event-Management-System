using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {

        private FeedbackService _service;


        public FeedbackController(FeedbackService service)
        {
            _service = service;
        }


        // [Authorize(Roles = "Admin")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {

                return Ok(await _service.GetAllFeedbacks());

            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }   
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var f = await _service.GetFeedbacksByUserId(userId);

                if (f == null)
                {
                    return Ok(new string[] { });
                }

                return Ok(f);
            }
            catch (Exception e)
            {

                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }


        [Authorize(Roles = "User")]
        [HttpPost]

        public async Task<ActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {

                if (feedback != null)
                {


                    bool r = await _service.AddFeedback(feedback);


                    if (r)
                    {
                        return Ok("Feedback added successfully");
                    }
                }
                return StatusCode(500, "Internal Server");
            }
            catch (Exception e)
            {

                return StatusCode(500, "Internal Server");
            }
        }

        [Authorize(Roles = "User")]
        // [HttpDelete("user/{feedbackId}")]
        [HttpDelete("user/{feedbackId}")]
        public async Task<ActionResult>DeleteFeedback(int feedbackId){
            try{
                var f =  _service.GetFeedbacksByUserId(feedbackId);
 
                if(f!=null){
                    bool r =await _service.DeleteFeedback(feedbackId);
 
                    if(r){
 
                    return Ok();
                    }
                }
 
                return NotFound(new {message="Cannot find any feedback"});
 
            }catch(Exception e){
 
                return StatusCode(500,"Internal Server");
            }
        }

    }
}