using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace FoodLink.Tests.Controllers
{
    public class CommentsControllerTests
    {
        private FoodLinkContext GetContext()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            var context = new FoodLinkContext(options);
            context.Comments.AddRange(
                new Comment { Id = 1, CommentText = "Test Comment", RecipeId = 1, UserId = "user1" },
                new Comment { Id = 2, CommentText = "Another Comment", RecipeId = 1, UserId = "user2" }
            );
            context.SaveChanges();
            return context;
        }

        [Fact]
        public async Task GetComments_ReturnsCommentsForRecipe()
        {
            using var context = GetContext();
            var controller = new CommentsController(context);

            var result = await controller.GetComments(1);

            var comments = Assert.IsType<List<Comment>>(result.Value);
            Assert.Equal(2, comments.Count);
        }

        [Fact]
        public async Task GetComment_ReturnsSpecificComment()
        {
            using var context = GetContext();
            var controller = new CommentsController(context);

            var result = await controller.GetComment(1);

            var comment = Assert.IsType<Comment>(result.Value);
            Assert.Equal("Test Comment", comment.CommentText);
        }

        [Fact]
        public async Task GetComment_ReturnsNotFound_WhenCommentDoesNotExist()
        {
            using var context = GetContext();
            var controller = new CommentsController(context);

            var result = await controller.GetComment(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostComment_CreatesNewComment()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            var controller = new CommentsController(context);
            var newComment = new Comment
            {
                CommentText = "New comment",
                RecipeId = 2,
                UserId = "user3"
            };

            var result = await controller.PostComment(newComment);

            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var comment = Assert.IsType<Comment>(created.Value);
            Assert.Equal("New comment", comment.CommentText);
        }

        [Fact]
        public async Task PostComment_ReturnsBadRequest_WhenCommentIsEmpty()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            var controller = new CommentsController(context);
            var invalidComment = new Comment
            {
                CommentText = "", // invalid
                RecipeId = 2,
                UserId = "user3"
            };

            var result = await controller.PostComment(invalidComment);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Comment cannot be empty", badRequest.Value);
        }

        [Fact]
        public async Task DeleteComment_RemovesComment()
        {
            using var context = GetContext();
            var controller = new CommentsController(context);

            var result = await controller.DeleteComment(1);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(context.Comments.Find(1));
        }

        [Fact]
        public async Task DeleteComment_ReturnsNotFound_WhenCommentDoesNotExist()
        {
            using var context = GetContext();
            var controller = new CommentsController(context);

            var result = await controller.DeleteComment(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
