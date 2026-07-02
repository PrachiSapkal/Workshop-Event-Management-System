using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Data;

namespace dotnetapp.Services{
    public class UserService{
        private ApplicationDbContext _context;

        public UserService(ApplicationDbContext context){
            _context = context;
        }

        public User UserDetailsByUserId(int id){
                return _context.Users.FirstOrDefault(i=>i.UserId == id);
            }
    }
}