using System;
using dotnetapp.Data;
using dotnetapp.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

public async Task<(int, string)> Registration(User model, string role)
{
    string assignedRole = "User";
    var correctSecretKey = _configuration["SecretKey"];

    if (role == "Admin")
    {
        if (model.SecretKey != correctSecretKey)
            return (400, "Invalid Admin Secret Key.");

        assignedRole = "Admin";
    }

    if (assignedRole != "Admin")
    {
        model.SecretKey = null;
    }

    // Check for unique email, username, and mobile number
    bool emailExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
    if (emailExists)
        return (0, "Email already exists");

    bool usernameExists = await _context.Users.AnyAsync(u => u.Username == model.Username);
    if (usernameExists)
        return (0, "Username already exists");

    bool mobileExists = await _context.Users.AnyAsync(u => u.MobileNumber == model.MobileNumber);
    if (mobileExists)
        return (0, "Mobile number already exists");

    var appUser = new ApplicationUser
    {
        Email = model.Email,
        UserName = model.Email,
        Name = model.Username.Length > 30 ? model.Username.Substring(0, 30) : model.Username
    };

    var identityResult = await userManager.CreateAsync(appUser, model.Password);
    if (!identityResult.Succeeded)
        return (0, "User creation failed! Please check user details and try again");

    if (!await roleManager.RoleExistsAsync(assignedRole))
        await roleManager.CreateAsync(new IdentityRole(assignedRole));

    await userManager.AddToRoleAsync(appUser, assignedRole);

    var passwordHasher = new PasswordHasher<ApplicationUser>();
    var hashedPassword = passwordHasher.HashPassword(appUser, model.Password);

    var newUser = new User
    {
        Email = model.Email,
        Password = hashedPassword,
        Username = model.Username,
        MobileNumber = model.MobileNumber,
        UserRole = assignedRole,
        SecretKey = model.SecretKey
    };

    _context.Users.Add(newUser);
    await _context.SaveChangesAsync();

    return (1, "User created successfully!");
}

        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return (0, "Invalid email");

            if (!await userManager.CheckPasswordAsync(user, model.Password))
                return (0, "Invalid password");

            var userRoles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GenerateToken(authClaims);
            return (1, token);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:ValidIssuer"],
                audience: _configuration["Jwt:ValidAudience"],
                expires: DateTime.Now.AddHours(4),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
