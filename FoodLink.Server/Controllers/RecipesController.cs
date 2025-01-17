using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Data;
using FoodLink.Server.Models;


namespace FoodLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController: ControllerBase
    {
        private readonly FoodLinkContext _context;

        public RecipesController(FoodLinkContext context)
        {
            _context = context;
        }

        // GET: api/Recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            return await _context.Recipes.ToListAsync();
        }

        // GET: api/Recipes/search?title="search"&orderRecent=false
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

        // GET: api/Recipes/5
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

        // PUT: api/Recipes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, Recipe Recipe)
        {
            if (id != Recipe.Id)
            {
                return BadRequest();
            }

            _context.Entry(Recipe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecipeExists(id))
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

        // POST: api/Recipes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(Recipe Recipe)
        {
            _context.Recipes.Add(Recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRecipe", new { id = Recipe.Id }, Recipe);
        }

        // DELETE: api/Recipes/5
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

        private bool RecipeExists(int id)
        {
            return _context.Recipes.Any(e => e.Id == id);
        }
    }
}
