﻿using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FoodLink.Server.Controllers
{
    [ApiController]
    public class CustomAccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public CustomAccountController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
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
}

