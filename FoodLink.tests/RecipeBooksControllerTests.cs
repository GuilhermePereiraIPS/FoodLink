using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;

namespace FoodLink.Tests.Controllers
{
    public class RecipeBookControllerTests
    {
        private FoodLinkContext GetContextWithSeedData()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new FoodLinkContext(options);

            context.RecipeBooks.AddRange(
                new RecipeBook { Id = 1, RecipeBookTitle = "Book 1", UserId = "user1" },
                new RecipeBook { Id = 2, RecipeBookTitle = "Book 2", UserId = "user2" }
            );
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetUserRecipeBooks_ReturnsBooksForUser()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);

            var actionResult = await controller.GetUserRecipeBooks("user1");
            var result = Assert.IsType<OkObjectResult>(actionResult);
            var books = Assert.IsType<List<RecipeBook>>(result.Value);

            Assert.Single(books);
            Assert.Equal("Book 1", books[0].RecipeBookTitle);
        }

        [Fact]
        public async Task CreateRecipeBook_ShouldReturnCreatedBook()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            var controller = new RecipeBookController(context);
            var newBook = new RecipeBook { RecipeBookTitle = "New Book", UserId = "user3" };

            var actionResult = await controller.CreateRecipeBook(newBook);
            var result = Assert.IsType<CreatedAtActionResult>(actionResult);
            var createdBook = Assert.IsType<RecipeBook>(result.Value);

            Assert.Equal("New Book", createdBook.RecipeBookTitle);
            Assert.Equal("user3", createdBook.UserId);
        }


        [Fact]
        public async Task UpdateRecipeBook_ChangesBookTitle()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);
            var updated = new RecipeBook { Id = 1, RecipeBookTitle = "Updated", UserId = "user1" };

            var actionResult = await controller.UpdateRecipeBook(1, updated);
            var result = Assert.IsType<OkObjectResult>(actionResult);
            var book = Assert.IsType<RecipeBook>(result.Value);

            Assert.Equal("Updated", book.RecipeBookTitle);
        }

        [Fact]
        public async Task UpdateRecipeBook_ReturnsBadRequest_WhenIdMismatch()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);
            var updated = new RecipeBook { Id = 999, RecipeBookTitle = "Invalid", UserId = "user1" };

            var result = await controller.UpdateRecipeBook(1, updated);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid Recipe Book data.", badRequest.Value);
        }

        [Fact]
        public async Task UpdateRecipeBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);
            var updated = new RecipeBook { Id = 999, RecipeBookTitle = "Missing", UserId = "user1" };

            var result = await controller.UpdateRecipeBook(999, updated);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Recipe Book not found.", notFound.Value);
        }

        [Fact]
        public async Task DeleteRecipeBook_RemovesBook()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);

            var actionResult = await controller.DeleteRecipeBook(2);
            var result = Assert.IsType<OkObjectResult>(actionResult);

            var message = result.Value?.ToString() ?? "";
            Assert.Contains("deleted successfully", message);
            Assert.Null(context.RecipeBooks.Find(2));
        }

        [Fact]
        public async Task DeleteRecipeBook_ReturnsNotFound_WhenBookDoesNotExist()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipeBookController(context);

            var result = await controller.DeleteRecipeBook(999);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Recipe Book not found.", notFound.Value);
        }

        [Fact]
        public void GetRecipesByBook_ReturnsAssociatedRecipes()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            context.Recipes.Add(new Recipe { Id = 1, Title = "Test Recipe" });
            context.RecipeToRB.Add(new RecipeToRB { IdRecipeBook = 1, IdRecipe = 1 });
            context.SaveChanges();

            var controller = new RecipeBookController(context);

            var actionResult = controller.GetRecipesByBook(1);
            var result = Assert.IsType<OkObjectResult>(actionResult);

            var recipes = Assert.IsType<List<Recipe>>(result.Value);
            Assert.Single(recipes);
            Assert.Equal("Test Recipe", recipes[0].Title);
        }
    }
}
