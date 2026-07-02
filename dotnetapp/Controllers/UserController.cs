using System;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using log4net;
using System.Reflection;
 
namespace dotnetapp.Controllers{
    [ApiController]
    [Route("api/users")]
    public class UserController:ControllerBase{

        private UserService _service;

        public UserController(UserService service){
            _service=service;
        }

        [HttpGet]
        [Route("userDetails/{userId}")]
        public async Task<ActionResult<User>> GetUserDetailsUsingId(int userId){
            var fUser =  _service.UserDetailsByUserId(userId); // await added

            if(fUser == null){
                return NotFound();
            }

            return Ok(fUser);
        }
    }
}