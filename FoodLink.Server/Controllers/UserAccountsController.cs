using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using FoodLink.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Data;
using FoodLink.Server.Services;

namespace FoodLink.Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing user account operations such as registration, login, and profile management.
    /// </summary>
    [ApiController]
    public class UserAccountsController : ControllerBase
    {
        private readonly FoodLinkContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;


        /// <summary>
        /// Initializes a new instance of the <see cref="UserAccountsController"/> class.
        /// </summary>
        /// <param name="userManager">The user manager for handling Identity operations.</param>
        /// <param name="configuration">The configuration for accessing app settings (e.g., JWT settings).</param>
        public UserAccountsController(UserManager<ApplicationUser> userManager, IConfiguration configuration, FoodLinkContext context, IEmailService emailService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _emailService = emailService;
        }

        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <param name="model">The data of the user to be registered.</param>
        /// <returns>An <see cref="IActionResult"/> indicating success or a validation error.</returns>
        /// <response code="200">User registered successfully.</response>
        /// <response code="400">User already exists or validation errors occurred.</response>
        [HttpPost("api/signup")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return BadRequest(new { message = "User already exists." });

            var user = new ApplicationUser { UserName = model.Name, Email = model.Email};

            // Generate activation token
            var token = Guid.NewGuid().ToString();
            user.ActivationToken = token;
            await _userManager.UpdateAsync(user);

            // Send activation email
            await _emailService.SendActivationEmailAsync(user.Email, token);

            var result = await _userManager.CreateAsync(user, model.Password);
            await _userManager.AddToRoleAsync(user, "Member");

            if (result.Succeeded)
            {                
                return Ok(new { message = "User registered successfully." });
            }

            return BadRequest(result.Errors);
        }


        /// <summary>
        /// Authenticates a user and returns a JWT token upon successful login.
        /// </summary>
        /// <param name="model">The user login credentials.</param>
        /// <returns>An <see cref="IActionResult"/> containing a JWT token and expiration date on success.</returns>
        /// <response code="200">Login successful, returns token and expiration.</response>
        /// <response code="400">Invalid email or password.</response>
        [HttpPost("api/signin")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {


            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid email or password." });
            }
            var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordValid)
            {
                return BadRequest(new { message = "Invalid email or password." });
            }

            if (!user.EmailConfirmed)
                return Unauthorized(new { message = "Account not activated" });

            // Gerar os claims do utilizador
            var claims = new List<Claim>
            {
                new Claim("Name", user.UserName),
                new Claim("Email", user.Email),
                new Claim("UserId", user.Id)
            };

            // Gerar o token JWT
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1), // Definir o tempo de expiração
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Retornar o token ao cliente
            return Ok(new
            {
                token = tokenString,
                expiration = token.ValidTo
            });
        }

        /// <summary>
        /// Retrieves information about a user based on their username or ID.
        /// </summary>
        /// <param name="username">The username of the user (optional).</param>
        /// <param name="id">The ID of the user (optional).</param>
        /// <returns>An <see cref="IActionResult"/> containing user details or an error message.</returns>
        /// <response code="200">User information retrieved successfully.</response>
        /// <response code="400">Neither username nor ID provided.</response>
        /// <response code="404">User not found.</response>
        [HttpGet("api/getUserInfo")]
        public async Task<IActionResult> GetUserInfo([FromQuery] string? username, [FromQuery] string? id)
        {
            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "Username or Id is required." });
            }

            ApplicationUser? user = null;

            if (!string.IsNullOrEmpty(id))
            {
                user = await _userManager.FindByIdAsync(id);
                Console.WriteLine($"User by ID: {user?.Id}");
            }
            if (!string.IsNullOrEmpty(username))
            {
                user = await _userManager.FindByNameAsync(username);
                Console.WriteLine($"User by username: {user?.UserName}");
            }

            if (user == null)
            {
                return NotFound(new { message = "User not found." });

            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                aboutMe = user.AboutMe,
                recipes = user.Recipes,
                role = roles.FirstOrDefault() // apenas uma role por utilizador
            });
        }

        /// <summary>
        /// Retrieves the authenticated user's information, either just the ID or full non-sensitive details.
        /// </summary>
        /// <param name="includeDetails">If true, returns full user details; if false (default), returns only the ID.</param>
        /// <returns>An <see cref="IActionResult"/> containing user ID or detailed profile information.</returns>
        /// <response code="200">User information retrieved successfully.</response>
        /// <response code="401">User is not authenticated.</response>
        [HttpGet("api/getCurrentUser")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser([FromQuery] bool includeDetails = false)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized(new { message = "User not found." });

            if (includeDetails)
            {

                var roles = await _userManager.GetRolesAsync(user);

                //getcurrentuser e getuserinfo com este codigo repetido, dar refact
                return Ok(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    aboutMe = user.AboutMe,
                    recipes = user.Recipes,
                    role = roles.FirstOrDefault() // uma role -
                });
            }

            return Ok(new { userID = user.Id });
        }


        /// <summary>
        /// Updates the authenticated user's information based on provided data.
        /// </summary>
        /// <param name="model">The updated user information.</param>
        /// <returns>An <see cref="IActionResult"/> indicating success or an error.</returns>
        /// <response code="200">User information updated successfully.</response>
        /// <response code="400">Validation errors (e.g., incorrect password, email in use).</response>
        /// <response code="401">User is not authenticated.</response>
        /// <response code="404">Authenticated user not found.</response>
        [HttpPut("api/updateCurrentUser")]
        [Authorize]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UserUpdateModel model)
        {
            if (string.IsNullOrEmpty(model.CurrentPassword)) return BadRequest(new { message = "Current password is required" });

            ApplicationUser user = await GetCurrentUser();
            if (user == null) return NotFound(new { message = "User not found." });
            
            // Username
            if (!string.IsNullOrEmpty(model.Username) && model.Username != user.UserName)
            {
                var emailExists = await _userManager.FindByEmailAsync(model.Email);
                user.UserName = model.Username;
            }

            // Email
            if (!string.IsNullOrEmpty(model.Email) && model.Email != user.Email)
            {
                var emailExists = await _userManager.FindByEmailAsync(model.Email);
                if (emailExists != null) return BadRequest(new { message = "Email already in use." });

                var emailChangeResult = await _userManager.SetEmailAsync(user, model.Email);
                if (!emailChangeResult.Succeeded)
                {
                    return BadRequest(emailChangeResult.Errors);
                }
            }

            // About me
            if (!string.IsNullOrEmpty(model.AboutMe))
            {
                user.AboutMe = model.AboutMe;
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
            if (!passwordValid)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            // Password
            if (!string.IsNullOrEmpty(model.Password))
            {

                var passwordChangeResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
                if (!passwordChangeResult.Succeeded)
                {
                    return BadRequest(passwordChangeResult.Errors);
                }
            }

            var updateResult = await _userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
            {
                return Ok(new { message = "User information updated successfully." });
            }

            return BadRequest(updateResult.Errors);
        }

        /// <summary>
        /// Retrieves a list of all users with their IDs and usernames.
        /// </summary>
        /// <returns>An <see cref="IActionResult"/> containing a list of user objects.</returns>
        /// <response code="200">List of users retrieved successfully.</response>
        [HttpGet("api/users")]
        public IActionResult GetAllUsers()
        {
            var users = _userManager.Users.Select(user => new
            {
                id = user.Id,
                username = user.UserName,
            }).ToList();

            return Ok(users);
        }

        /// <summary>
        /// Retrieves all recipes associated with a user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user whose recipes are to be retrieved.</param>
        /// <returns>An <see cref="IActionResult"/> containing the list of recipes or an error.</returns>
        /// <response code="200">Recipes retrieved successfully.</response>
        /// <response code="400">User ID is required but not provided.</response>
        /// <response code="404">User not found.</response>
        [HttpGet("api/getUserRecipes")]
        public async Task<IActionResult> GetUserRecipes([FromQuery] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var recipes = await _context.Recipes
                .Where(r => r.UserId == id)
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("api/getUserRecipeBooks")]
        public async Task<IActionResult> GetUserRecipeBooks([FromQuery] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID is required." });
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var recipeBooks = await _context.RecipeBooks
                .Where(r => r.UserId == id)
                .ToListAsync();

            return Ok(recipeBooks);
        }

        [HttpGet("activate")]
        public async Task<IActionResult> ActivateAccount(string token)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.ActivationToken == token);
            if (user == null)
                return BadRequest(new { message = "Invalid or expired token." });

            user.EmailConfirmed = true;
            user.ActivationToken = null; // Clear token after use
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Account activated successfully." });
        }


        /// <summary>
        /// Verifies if the provided password is correct for the given user.
        /// </summary>
        /// <param name="user">The user whose password is to be verified.</param>
        /// <param name="password">The password to check.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the password verification.</returns>
        private async Task<bool> IsPasswordValid(ApplicationUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        /// <summary>
        /// Retrieves the currently authenticated user using claims.
        /// </summary>
        /// <returns>A <see cref="Task{TResult}"/> representing the current user as an <see cref="ApplicationUser"/> or null if not authenticated.</returns>
        private async Task<ApplicationUser> GetCurrentUser()
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserIDClaim = currentUser.FindFirst("UserId");

            if (currentUserIDClaim == null) return null;

            var currentUserID = currentUserIDClaim.Value;
            var user = await _userManager.FindByIdAsync(currentUserID);

            return user;
        }
    }

    /// <summary>
    /// Represents basic user information for display purposes.
    /// </summary>
    public class UserInfoModel
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AboutMe { get; set; }
    }

    /// <summary>
    /// Represents the data model for updating user information.
    /// </summary>
    public class UserUpdateModel
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AboutMe { get; set; }
        public string? Password { get; set; }
        public string? CurrentPassword { get; set; } // Needed to check if the current password is correct when updating
    }

    /// <summary>
    /// Represents the data model for user login.
    /// </summary>
    public class UserLoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    /// <summary>
    /// Represents the data model for user registration.
    /// </summary>
    public class UserRegistrationModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
    }
}
