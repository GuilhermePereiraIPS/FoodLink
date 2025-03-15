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
        public async Task<IActionResult> GetUserRecipeBooks([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest(new { message = "User ID is required." });

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipeBook(int id, [FromBody] RecipeBook updatedBook)
        {
            if (updatedBook == null || id != updatedBook.IdRecipeBook)
            {
                return BadRequest("Invalid Recipe Book data.");
            }

            var existingBook = await _context.RecipeBooks.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound("Recipe Book not found.");
            }

            // Atualizar os dados do Recipe Book
            existingBook.RecipeBookTitle = updatedBook.RecipeBookTitle;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingBook); // Retorna o Recipe Book atualizado
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipeBook(int id)
        {
            var recipeBook = await _context.RecipeBooks.FindAsync(id);
            if (recipeBook == null)
            {
                return NotFound("Recipe Book not found.");
            }

            _context.RecipeBooks.Remove(recipeBook);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Recipe Book deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
