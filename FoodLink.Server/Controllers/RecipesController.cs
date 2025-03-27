using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;


namespace FoodLink.Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing recipes.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController: ControllerBase
    {
        private readonly FoodLinkContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="RecipesController"/> class.
        /// </summary>
        /// <param name="context">The database context for accessing recipe data.</param>
        public RecipesController(FoodLinkContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        /// <summary>
        /// Retrieves all recipes.
        /// </summary>
        /// <returns>An <see cref="ActionResult{T}"/> containing a list of all recipes.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            return await _context.Recipes.ToListAsync();
        }

        /// <summary>
        /// Searches for recipes based on title and optional sorting by recent creation date.
        /// </summary>
        /// <param name="title">The title or partial title to search for (optional, defaults to empty string).</param>
        /// <param name="orderRecent">If true, sorts recipes by most recent first; defaults to false.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing a filtered list of recipes.</returns>
        /// <response code="200">Recipes retrieved successfully based on search criteria.</response>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipesSearch(
            [FromQuery] string title = "",
            [FromQuery] bool orderRecent = false
        )
        {
            // Apply search filters
            var recipes = _context.Recipes.AsQueryable();
            //query vazia
            if (!string.IsNullOrWhiteSpace(title))
                recipes = recipes.Where(r => r.Title.Contains(title));

            if (orderRecent) 
                recipes = recipes.OrderByDescending(recipe => recipe.CreateDate);

            return await recipes.ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific recipe by its ID.
        /// </summary>
        /// <param name="id">The ID of the recipe to retrieve.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing the requested recipe.</returns>
        /// <response code="200">Recipe retrieved successfully.</response>
        /// <response code="404">Recipe not found.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            var Recipe = await _context.Recipes.FindAsync(id);

            if (Recipe == null)
            {
                return NotFound();
            }

            return Recipe;
        }


        /// <summary>
        /// Creates a new recipe.
        /// </summary>
        /// <param name="recipe">The recipe object to be created.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing the created recipe.</returns>
        /// <response code="201">Recipe created successfully, returns the created recipe.</response>
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(Recipe recipe)
        {
            if (string.IsNullOrEmpty(recipe.UserId))
            {
                return BadRequest("UserId is required.");
            }

            var user = await _userManager.FindByIdAsync(recipe.UserId);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // if Recipes collection not created then create
            if (user.Recipes == null)
            {
                user.Recipes = new List<Recipe>();
            }
            user.Recipes.Add(recipe);
            recipe.CreateDate = DateTime.UtcNow; // CreateDate is set server-side

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipe", new { id = recipe.Id }, recipe);
        }

        /// <summary>
        /// Deletes a recipe by its ID.
        /// </summary>
        /// <param name="id">The ID of the recipe to delete.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the deletion.</returns>
        /// <response code="204">Recipe deleted successfully.</response>
        /// <response code="404">Recipe not found.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var Recipe = await _context.Recipes.FindAsync(id);
            if (Recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(Recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Updates an existing recipe.
        /// </summary>
        /// <param name="id">The ID of the recipe to update.</param>
        /// <param name="recipe">The updated recipe data.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the update.</returns>
        /// <response code="204">Recipe updated successfully.</response>
        /// <response code="400">Recipe ID mismatch.</response>
        /// <response code="404">Recipe not found.</response>
        /// <response code="500">Error updating the recipe due to concurrency or server issues.</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest("Recipe ID mismatch");
            }

            var existingRecipe = await _context.Recipes.FindAsync(id);
            if (existingRecipe == null)
            {
                return NotFound("Recipe not found");
            }

            // Atualiza os valores
            existingRecipe.Title = recipe.Title;
            existingRecipe.Description = recipe.Description;
            existingRecipe.Ingredients = recipe.Ingredients;
            existingRecipe.Instructions = recipe.Instructions;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error updating the recipe");
            }
        }

        /// <summary>
        /// Checks if a recipe exists by its ID.
        /// </summary>
        /// <param name="id">The ID of the recipe to check.</param>
        /// <returns>A boolean indicating whether the recipe exists.</returns>
        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
}
