using Azure.Identity;
using FoodLink.Server.Data;
using FoodLink.Server.DTOs;
using FoodLink.Server.Interfaces;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FoodLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly FoodLinkContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(FoodLinkContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;   
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await AppUserExists(registerDto.Username))
                return BadRequest("Username is taken");
            if(registerDto.Username == "")
                return BadRequest("Password can't be empty");

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };


            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null)
                return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i = 0; i<computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }


            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        // GET: api/Account
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetAccount()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Account/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetAppUser(int id)
        {
            var AppUser = await _context.Users.FindAsync(id);

            if (AppUser == null)
            {
                return NotFound();
            }

            return AppUser;
        }

        // PUT: api/Account/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppUser(int id, AppUser AppUser)
        {
            if (id != AppUser.Id)
            {
                return BadRequest();
            }

            _context.Entry(AppUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppUserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Account/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppUser(int id)
        {
            var AppUser = await _context.Users.FindAsync(id);
            if (AppUser == null)
            {
                return NotFound();
            }

            _context.Users.Remove(AppUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> AppUserExists(string username)
        {
            return await _context.Users.AnyAsync(e => e.UserName.ToLower() == username.ToLower());
        }
        private bool AppUserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
    
}
