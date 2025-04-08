using FoodLink.Server.Data;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FoodLink.Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing comments related to recipes.
    /// </summary>
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly FoodLinkContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="CommentsController"/> class.
        /// </summary>
        /// <param name="context">The database context for accessing comment data.</param>
        public CommentsController(FoodLinkContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all comments associated with a specific recipe.
        /// </summary>
        /// <param name="recipeId">The ID of the recipe to fetch comments for.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing a list of comments for the specified recipe.</returns>
        /// <response code="200">Comments retrieved successfully.</response>
        [HttpGet("comments/{recipeId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments(int recipeId)
        {
            return await _context.Comments
                .Where(c => c.RecipeId == recipeId)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a specific comment by its ID.
        /// </summary>
        /// <param name="commentId">The ID of the comment to retrieve.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing the requested comment or a not found response.</returns>
        /// <response code="200">Comment retrieved successfully.</response>
        /// <response code="404">Comment not found.</response>
        [HttpGet("{commentId}")]
        public async Task<ActionResult<Comment>> GetComment(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        /// <summary>
        /// Creates a new comment for a recipe.
        /// </summary>
        /// <param name="comment">The comment object to be created.</param>
        /// <returns>An <see cref="ActionResult{T}"/> containing the created comment or an error message.</returns>
        /// <response code="201">Comment created successfully, returns the created comment.</response>
        /// <response code="400">Comment text is empty or invalid.</response>
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if (string.IsNullOrEmpty(comment.CommentText))
                return BadRequest("Comment cannot be empty");


            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetComments), new { recipeId = comment.RecipeId }, comment);
        }

        /// <summary>
        /// Deletes a comment by its ID.
        /// </summary>
        /// <param name="id">The ID of the comment to delete.</param>
        /// <returns>An <see cref="IActionResult"/> indicating the result of the deletion.</returns>
        /// <response code="204">Comment deleted successfully.</response>
        /// <response code="404">Comment not found.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound(); // Retorna erro 404 se o comentário não existir
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent(); // Retorna status 204 - No Content
        }
    }
}
