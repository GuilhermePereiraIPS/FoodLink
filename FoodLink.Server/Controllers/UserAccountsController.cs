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

namespace FoodLink.Server.Controllers
{
    [ApiController]
    public class UserAccountsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public UserAccountsController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        /// <summary>
        /// Registra um novo utilizador.
        /// </summary>
        /// <param name="model">Dados do utilizador a ser registado.</param>
        /// <returns>Retorna sucesso ou erro de validação.</returns>
        [HttpPost("api/signup")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return BadRequest(new { message = "User already exists." });

            var user = new ApplicationUser { UserName = model.Name, Email = model.Email};

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {                
                return Ok(new { message = "User registered successfully." });
            }

            return BadRequest(result.Errors);
        }


        /// <summary>
        /// Autentica um utilizador e retorna um token JWT.
        /// </summary>
        /// <param name="model">Dados de login do utilizador.</param>
        /// <returns>Retorna um token JWT em caso de sucesso.</returns>
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
        /// Retorna a informação do utilizador, seja por username ou id
        /// </summary>
        /// <param name="username"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("api/getUserInfo")]
        public async Task<IActionResult> GetUserInfo([FromQuery] string? username, [FromQuery] string? id)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest(new { message = "Username or Id is required." });
            }

            ApplicationUser? user = null;

            if (!string.IsNullOrEmpty(id))
            {
                user = await _userManager.FindByIdAsync(id);
            }
            else if (!string.IsNullOrEmpty(username))
            {
                user = await _userManager.FindByNameAsync(username);
            }

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                aboutMe = user.AboutMe,
                recipes = user.Recipes
            });
        }

        /// <summary>
        /// Retorna o utilizador autenticado, o id ou a informação toda (não sensivel)
        /// </summary>
        /// <param name="includeDetails">Por omissão falso, retorna apenas o id, caso false retorna </param>
        /// <returns>
        /// Retorna um <see cref="UserProfileModel"/> contendo o ID, nome e email do utilizador.
        /// Se o utilizador não estiver autenticado, retorna uma resposta Unauthorized (401).
        /// </returns>
        [HttpGet("api/getCurrentUser")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser([FromQuery] bool includeDetails = false)
        {
            var user = await GetCurrentUser();
            if (user == null) return Unauthorized(new { message = "User not found." });

            if (includeDetails)
            {
                //getcurrentuser e getuserinfo com este codigo repetido, dar refact
                return Ok(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    aboutMe = user.AboutMe,
                    recipes = user.Recipes
                });
            }

            return Ok(new { userID = user.Id });
        }


        /// <summary>
        /// Atualiza informações do utilizador dependendo do que é enviado
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
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

            // Password
            if (!string.IsNullOrEmpty(model.Password))
            {

                var passwordChangeResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
                if (!passwordChangeResult.Succeeded)
                {
                    return BadRequest(passwordChangeResult.Errors);
                }
            }
            

            var passwordValid = await _userManager.CheckPasswordAsync(user, model.CurrentPassword);
            if (!passwordValid)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }


            var updateResult = await _userManager.UpdateAsync(user);

            if (updateResult.Succeeded)
            {
                return Ok(new { message = "User information updated successfully." });
            }

            return BadRequest(updateResult.Errors);
        }

        /// <summary>
        /// Verifica se a password do utilizador está correta
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        private async Task<bool> IsPasswordValid(ApplicationUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        /// <summary>
        /// Usa claims para buscar o utilizador atual
        /// </summary>
        /// <returns>Retorna o utilizador atual<see cref="ApplicationUser"/></returns>
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


    public class UserInfoModel
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AboutMe { get; set; }
    }

    public class UserUpdateModel
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AboutMe { get; set; }
        public string? Password { get; set; }
        public string? CurrentPassword { get; set; } // Needed to check if the current password is correct when updating
    }

    public class UserLoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }


    public class UserRegistrationModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
    }
}
