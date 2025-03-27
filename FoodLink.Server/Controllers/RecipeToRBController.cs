using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodLink.Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing associations between recipes and recipe books.
    /// </summary>
    [Route("api/recipetorb")]
    [ApiController]
    public class RecipeToRBController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="RecipeToRBController"/> class.
        /// </summary>
        /// <param name="context">The database context for accessing recipe-to-recipe-book associations.</param>
        public RecipeToRBController(FoodLinkContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Associates a recipe with a recipe book.
        /// </summary>
        /// <param name="recipeToRB">The association data containing recipe ID and recipe book ID.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the association.</returns>
        /// <response code="200">Recipe associated with the recipe book successfully.</response>
        /// <response code="400">Invalid data or recipe already in the recipe book.</response>
        [HttpPost]
        public async Task<IActionResult> AddRecipeToBook([FromBody] RecipeToRB recipeToRB)
        {
            if (recipeToRB == null)
            {
                return BadRequest("Invalid data.");
            }

            // Verifica se a receita já está no Recipe Book
            var exists = await _context.RecipeToRB
                .AnyAsync(r => r.IdRecipe == recipeToRB.IdRecipe && r.IdRecipeBook == recipeToRB.IdRecipeBook);

            if (exists)
            {
                return BadRequest("This recipe is already in the Recipe Book.");
            }

            _context.RecipeToRB.Add(recipeToRB);
            await _context.SaveChangesAsync();
            return Ok(recipeToRB);
        }

        /// <summary>
        /// Retrieves all recipes associated with a specific recipe book.
        /// </summary>
        /// <param name="id">The ID of the recipe book.</param>
        /// <returns>An <see cref="IActionResult"/> containing a list of recipes in the recipe book.</returns>
        /// <response code="200">Recipes retrieved successfully.</response>
        /// <response code="404">No recipes found for this recipe book.</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipesByRecipeBook(int id)
        {
            var recipeIds = await _context.RecipeToRB
                .Where(rtrb => rtrb.IdRecipeBook == id)
                .Select(rtrb => rtrb.IdRecipe)
                .ToListAsync();

            if (!recipeIds.Any())
            {
                return NotFound(new { message = "No recipes found for this Recipe Book." });
            }

            var recipes = await _context.Recipes
                .Where(recipe => recipeIds.Contains(recipe.Id))
                .ToListAsync();

            return Ok(recipes);
        }

        /// <summary>
        /// Removes a recipe from a recipe book.
        /// </summary>
        /// <param name="idRecipe">The ID of the recipe to remove.</param>
        /// <param name="idRecipeBook">The ID of the recipe book.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the removal.</returns>
        /// <response code="200">Recipe removed successfully.</response>
        /// <response code="404">Association between recipe and recipe book not found.</response>
        [HttpDelete("{idRecipe}/{idRecipeBook}")]
        public async Task<IActionResult> RemoveRecipeFromBook(int idRecipe, int idRecipeBook)
        {
            var recipeToRB = await _context.RecipeToRB
                .FirstOrDefaultAsync(r => r.IdRecipe == idRecipe && r.IdRecipeBook == idRecipeBook);

            if (recipeToRB == null)
            {
                return NotFound("Association not found.");
            }

            _context.RecipeToRB.Remove(recipeToRB);
            await _context.SaveChangesAsync();
            return Ok("Recipe removed from Recipe Book.");
        }
    }
}
