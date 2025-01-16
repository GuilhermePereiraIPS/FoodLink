using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FoodLink.Server.Controllers
{
    [ApiController]
    public class CustomAccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;

        public CustomAccountController(UserManager<AppUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("login2")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }
        private string GenerateJwtToken(IdentityUser user)
        {
            var claims = new[]{
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName) 
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer: _configuration["Jwt:Issuer"], audience: _configuration["Jwt:Audience"], claims: claims, expires: DateTime.Now.AddMinutes(30), signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpPost]
        [Route("api/register")]
        public async Task<IActionResult> Register([FromBody] CustomRegisterModel model)
        {
            var user = new AppUser { UserName = model.Email, Email = model.Email, Name = model.Name };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("api/logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);

            // Retorna uma resposta apropriada, como um status 200 OK
            return Ok(new { message = "Logout successful" });
        }

    }

    public class CustomRegisterModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }

    public class LoginRequest2 { 
        public string Username { get; set; }
        public string Password { get; set; }
    }
}

