using System.Security.Claims;
using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodLink.Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing recipe books and their associated recipes.
    /// </summary>
    [Route("api/recipebooks")]
    [ApiController]
    public class RecipeBookController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="RecipeBookController"/> class.
        /// </summary>
        /// <param name="context">The database context for accessing recipe book data.</param>
        public RecipeBookController(FoodLinkContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all recipe books for a specified user.
        /// </summary>
        /// <param name="userId">The ID of the user whose recipe books are to be retrieved.</param>
        /// <returns>An <see cref="IActionResult"/> containing a list of recipe books.</returns>
        /// <response code="200">Recipe books retrieved successfully.</response>
        /// <response code="400">User ID is required but not provided.</response>
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
        /// Creates a new recipe book.
        /// </summary>
        /// <param name="recipeBook">The recipe book object to be created.</param>
        /// <returns>An <see cref="IActionResult"/> containing the created recipe book or an error message.</returns>
        /// <response code="201">Recipe book created successfully, returns the created recipe book.</response>
        /// <response code="400">Recipe book title is required but not provided.</response>
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

            return CreatedAtAction(nameof(GetUserRecipeBooks), new { id = recipeBook.Id }, recipeBook);
        }

        /// <summary>
        /// Updates an existing recipe book.
        /// </summary>
        /// <param name="id">The ID of the recipe book to update.</param>
        /// <param name="updatedBook">The updated recipe book data.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the update.</returns>
        /// <response code="200">Recipe book updated successfully, returns the updated recipe book.</response>
        /// <response code="400">Invalid recipe book data or ID mismatch.</response>
        /// <response code="404">Recipe book not found.</response>
        /// <response code="500">Internal server error occurred during update.</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipeBook(int id, [FromBody] RecipeBook updatedBook)
        {
            if (updatedBook == null || id != updatedBook.Id)
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

        /// <summary>
        /// Deletes a recipe book by its ID.
        /// </summary>
        /// <param name="id">The ID of the recipe book to delete.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the deletion.</returns>
        /// <response code="200">Recipe book deleted successfully.</response>
        /// <response code="404">Recipe book not found.</response>
        /// <response code="500">Internal server error occurred during deletion.</response>
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

        /// <summary>
        /// Retrieves all recipes associated with a specific recipe book.
        /// </summary>
        /// <param name="id">The ID of the recipe book.</param>
        /// <returns>An <see cref="IActionResult"/> containing a list of recipes in the recipe book.</returns>
        /// <response code="200">Recipes retrieved successfully.</response>
        [HttpGet("{id}/recipes")]
        public IActionResult GetRecipesByBook(int id)
        {
            var recipes = _context.RecipeToRB
                .Where(r => r.IdRecipeBook == id)
                .Join(_context.Recipes,
                      rtb => rtb.IdRecipe,
                      r => r.Id,
                      (rtb, recipe) => recipe)
                .ToList();

            return Ok(recipes);
        }

        /// <summary>
        /// Removes a recipe from a recipe book.
        /// </summary>
        /// <param name="idRecipeBook">The ID of the recipe book.</param>
        /// <param name="idRecipe">The ID of the recipe to remove.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the removal.</returns>
        /// <response code="200">Recipe removed successfully.</response>
        /// <response code="404">Recipe not found in the specified recipe book.</response>
        [HttpDelete("{idRecipeBook}/recipes/{idRecipe}")]
        public IActionResult RemoveRecipeFromBook(int idRecipeBook, int idRecipe)
        {
            var entry = _context.RecipeToRB
                .FirstOrDefault(r => r.IdRecipeBook == idRecipeBook && r.IdRecipe == idRecipe);

            if (entry == null)
            {
                return NotFound(new { message = "Recipe not found in this book." });
            }

            _context.RecipeToRB.Remove(entry);
            _context.SaveChanges();

            return Ok(new { message = "Recipe removed from book successfully!" });
        }

    }


}
