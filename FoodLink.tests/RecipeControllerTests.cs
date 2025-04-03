using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;
using System;

namespace FoodLink.Tests.Controllers
{
    public class RecipesControllerTests
    {
        private FoodLinkContext GetContextWithSeedData()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new FoodLinkContext(options);

            context.Recipes.AddRange(
                new Recipe { Id = 1, Title = "Recipe 1" },
                new Recipe { Id = 2, Title = "Recipe 2" }
            );

            context.SaveChanges();
            return context;
        }

        [Fact]
        public async Task GetRecipes_ReturnsAllRecipes()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipesController(context);

            var result = await controller.GetRecipes();
            var recipes = Assert.IsType<List<Recipe>>(result.Value);

            Assert.Equal(2, recipes.Count);
        }

        [Fact]
        public async Task GetRecipe_ReturnsCorrectRecipe()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipesController(context);

            var result = await controller.GetRecipe(1);
            var recipe = Assert.IsType<Recipe>(result.Value);

            Assert.Equal("Recipe 1", recipe.Title);
        }

        [Fact]
        public async Task PostRecipe_AddsRecipe()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            var controller = new RecipesController(context);

            var newRecipe = new Recipe
            {
                Title = "New Recipe",
                Description = "Desc",
                Ingredients = "Ingredients",
                Instructions = "Instructions",
                CreateDate = DateTime.Now
            };

            var result = await controller.PostRecipe(newRecipe);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);

            var created = Assert.IsType<Recipe>(actionResult.Value);

            Assert.Equal("New Recipe", created.Title);
        }

        [Fact]
        public async Task DeleteRecipe_RemovesRecipe()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipesController(context);

            var result = await controller.DeleteRecipe(1);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(context.Recipes.Find(1));
        }

        [Fact]
        public async Task PutRecipe_UpdatesRecipe()
        {
            using var context = GetContextWithSeedData();
            var controller = new RecipesController(context);

            var updated = new Recipe
            {
                Id = 1,
                Title = "Updated Title",
                Description = "Updated Description",
                Ingredients = "Updated Ingredients",
                Instructions = "Updated Instructions"
            };

            var result = await controller.PutRecipe(1, updated);

            Assert.IsType<NoContentResult>(result);
            Assert.Equal("Updated Title", context.Recipes.Find(1)?.Title);
        }
    }
}
