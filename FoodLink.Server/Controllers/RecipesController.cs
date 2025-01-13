using Microsoft.AspNetCore.Mvc;
using FoodLink.Server.Models;
using FoodLink.Server.Data;
using System.Linq;

namespace FoodLink.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        public RecipesController(FoodLinkContext context)
        {
            _context = context;
        }

        // GET: api/Recipes
        [HttpGet]
        public IActionResult GetRecipes()
        {
            var recipes = _context.Recipe.ToList();
            return Ok(recipes);
        }

        // POST: api/Recipes
        [HttpPost]
        public IActionResult CreateRecipe([FromBody] Recipe recipe)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Recipe.Add(recipe);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetRecipes), new {id=recipe.Id}, recipe);
        }
    }
}
