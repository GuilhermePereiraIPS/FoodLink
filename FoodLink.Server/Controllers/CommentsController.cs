using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodLink.Server.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        public CommentsController(FoodLinkContext context)
        {
            _context = context;
        }

        // 🔹 Obter todos os comentários de uma receita específica
        [HttpGet("{recipeId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments(int recipeId)
        {
            return await _context.Comments
                .Where(c => c.RecipeId == recipeId)
                .ToListAsync();
        }

        // 🔹 Criar um novo comentário
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if (string.IsNullOrEmpty(comment.CommentText))
                return BadRequest("Comment cannot be empty");

            comment.UserId = 1;

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetComments), new { recipeId = comment.RecipeId }, comment);
        }
    }
}
