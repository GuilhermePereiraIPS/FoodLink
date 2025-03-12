using System.Security.Claims;
using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodLink.Server.Controllers
{
    [Route("api/recipebooks")]
    [ApiController]
    public class RecipeBookController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        public RecipeBookController(FoodLinkContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtém todos os Recipe Books do usuário autenticado
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetUserRecipeBooks()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });

            var recipeBooks = await _context.RecipeBooks
                .Where(rb => rb.UserId == userId)
                .ToListAsync();

            return Ok(recipeBooks);
        }

        /// <summary>
        /// Cria um novo Recipe Book
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRecipeBook([FromBody] RecipeBook recipeBook)
        {
            //Console.WriteLine($"Received RecipeBook: Title={recipeBook.RecipeBookTitle}, UserId={recipeBook.UserId}");

            if (string.IsNullOrEmpty(recipeBook.RecipeBookTitle))
                return BadRequest(new { message = "Recipe Book title is required." });

            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            /*if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });*/

            // Garante que o Recipe Book pertence ao usuário autenticado
            //recipeBook.UserId = userId;

            _context.RecipeBooks.Add(recipeBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserRecipeBooks), new { id = recipeBook.IdRecipeBook }, recipeBook);
        }
    }
}
