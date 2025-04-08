using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;

namespace FoodLink.Tests.Controllers
{
    public class RecipeToRBControllerTests
    {
        private FoodLinkContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new FoodLinkContext(options);

            context.Recipes.Add(new Recipe
            {
                Id = 1,
                Title = "Recipe 1",
                Description = "desc",
                Ingredients = "ing",
                Instructions = "inst",
                CreateDate = DateTime.Now,
                UserId = "user1"
            });

            context.RecipeBooks.Add(new RecipeBook
            {
                Id = 1,
                RecipeBookTitle = "Book 1",
                UserId = "user1"
            });

            context.RecipeToRB.Add(new RecipeToRB
            {
                Id = 1,
                IdRecipe = 1,
                IdRecipeBook = 1
            });

            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task AddRecipeToBook_ReturnsBadRequest_IfAlreadyExists()
        {
            using var context = GetInMemoryContext();
            var controller = new RecipeToRBController(context);

            var duplicate = new RecipeToRB { IdRecipe = 1, IdRecipeBook = 1 };

            var result = await controller.AddRecipeToBook(duplicate);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("This recipe is already in the Recipe Book.", badRequest.Value);
        }

        [Fact]
        public async Task AddRecipeToBook_AddsSuccessfully()
        {
            using var context = GetInMemoryContext();
            var controller = new RecipeToRBController(context);

            context.RecipeBooks.Add(new RecipeBook
            {
                Id = 99,
                RecipeBookTitle = "Book 99",
                UserId = "user1"
            });

            var newEntry = new RecipeToRB { IdRecipe = 1, IdRecipeBook = 99 };
            await context.SaveChangesAsync();

            var result = await controller.AddRecipeToBook(newEntry);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var added = Assert.IsType<RecipeToRB>(okResult.Value);
            Assert.Equal(1, added.IdRecipe);
            Assert.Equal(99, added.IdRecipeBook);
        }

        [Fact]
        public async Task GetRecipesByRecipeBook_ReturnsRecipes()
        {
            using var context = GetInMemoryContext();
            var controller = new RecipeToRBController(context);

            var result = await controller.GetRecipesByRecipeBook(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var recipes = Assert.IsType<List<Recipe>>(okResult.Value);
            Assert.Single(recipes);
            Assert.Equal("Recipe 1", recipes[0].Title);
        }

        /* [Fact]
         public async Task GetRecipesByRecipeBook_ReturnsNotFound_WhenNoneExist()
         {
             using var context = GetInMemoryContext();
             var controller = new RecipeToRBController(context);

             var result = await controller.GetRecipesByRecipeBook(999);

             var notFound = Assert.IsType<NotFoundObjectResult>(result);
             Assert.Equal("No recipes found for this Recipe Book.", ((dynamic)notFound.Value).message);
         }
        */
        [Fact]
        public async Task RemoveRecipeFromBook_RemovesSuccessfully()
        {
            using var context = GetInMemoryContext();
            var controller = new RecipeToRBController(context);

            var result = await controller.RemoveRecipeFromBook(1, 1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Recipe removed from Recipe Book.", okResult.Value);
        }

        [Fact]
        public async Task RemoveRecipeFromBook_ReturnsNotFound_IfNotExists()
        {
            using var context = GetInMemoryContext();
            var controller = new RecipeToRBController(context);

            var result = await controller.RemoveRecipeFromBook(99, 99);

            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Association not found.", notFound.Value);
        }
    }
}
