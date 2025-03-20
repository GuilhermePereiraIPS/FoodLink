using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodLink.Server.Controllers
{
    [Route("api/recipetorb")]
    [ApiController]
    public class RecipeToRBController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        public RecipeToRBController(FoodLinkContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Associa uma receita a um Recipe Book
        /// </summary>
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
        /// Lista todas as receitas associadas a um Recipe Book específico
        /// </summary>
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
        /// Remove uma receita de um Recipe Book
        /// </summary>
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
