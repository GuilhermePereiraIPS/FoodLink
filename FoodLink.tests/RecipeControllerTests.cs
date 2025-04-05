using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;
using System;
using Microsoft.AspNetCore.Identity;
using Moq;
using System.Linq;
using FoodLink.Server.Services;

namespace FoodLink.Tests.Controllers
{
    public class RecipesControllerTests
    {
        private static Mock<UserManager<ApplicationUser>> GetMockUserManager()
        {
            var store = new Mock<IUserStore<ApplicationUser>>();
            return new Mock<UserManager<ApplicationUser>>(
                store.Object, null, null, null, null, null, null, null, null
            );
        }

        private FoodLinkContext GetContextWithSeedData()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new FoodLinkContext(options);
            context.Recipes.AddRange(
                new Recipe { Id = 1, Title = "Recipe 1", UserId = "user1" },
                new Recipe { Id = 2, Title = "Recipe 2", UserId = "user2" }
            );
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetRecipes_ReturnsAllRecipes()
        {
            using var context = GetContextWithSeedData();
            var userManagerMock = GetMockUserManager();
            var pixabayServiceMock = new Mock<PixabayService>();
            var controller = new RecipesController(context, userManagerMock.Object, pixabayServiceMock.Object);

            var result = await controller.GetRecipes();
            var recipes = Assert.IsType<List<Recipe>>(result.Value);

            Assert.Equal(2, recipes.Count);
        }

        [Fact]
        public async Task GetRecipe_ReturnsCorrectRecipe()
        {
            using var context = GetContextWithSeedData();
            var pixabayServiceMock = new Mock<PixabayService>();
            var userManagerMock = GetMockUserManager();
            var controller = new RecipesController(context, userManagerMock.Object, pixabayServiceMock.Object);

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
            var userManagerMock = GetMockUserManager();

            var user = new ApplicationUser { Id = "user1", UserName = "testuser", Recipes = new List<Recipe>() };
            userManagerMock.Setup(u => u.FindByIdAsync("user1")).ReturnsAsync(user);

            var pixabayServiceMock = new Mock<PixabayService>();
            var controller = new RecipesController(context, userManagerMock.Object, pixabayServiceMock.Object);

            var newRecipe = new Recipe
            {
                Title = "New Recipe",
                Description = "Desc",
                Ingredients = "Ingredients",
                Instructions = "Instructions",
                UserId = "user1"
            };

            var result = await controller.PostRecipe(newRecipe);
            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var created = Assert.IsType<Recipe>(actionResult.Value);

            Assert.Equal("New Recipe", created.Title);
            Assert.Equal("user1", created.UserId);
        }

        [Fact]
        public async Task DeleteRecipe_RemovesRecipe()
        {
            using var context = GetContextWithSeedData();
            var userManagerMock = GetMockUserManager();
            var pixabayServiceMock = new Mock<PixabayService>();
            var controller = new RecipesController(context, userManagerMock.Object, pixabayServiceMock.Object);

            var result = await controller.DeleteRecipe(1);

            Assert.IsType<NoContentResult>(result);
            Assert.Null(context.Recipes.Find(1));
        }

        [Fact]
        public async Task PutRecipe_UpdatesRecipe()
        {
            var options = new DbContextOptionsBuilder<FoodLinkContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            using var context = new FoodLinkContext(options);
            context.Recipes.Add(new Recipe
            {
                Id = 1,
                Title = "Original",
                Description = "Old Desc",
                Ingredients = "Old Ing",
                Instructions = "Old Instr",
                UserId = "user1"
            });
            context.SaveChanges();

            var userManagerMock = GetMockUserManager();
            var pixabayServiceMock = new Mock<PixabayService>();
            var controller = new RecipesController(context, userManagerMock.Object, pixabayServiceMock.Object);

            var updated = new Recipe
            {
                Id = 1,
                Title = "Updated Title",
                Description = "Updated Desc",
                Ingredients = "Updated Ing",
                Instructions = "Updated Instr",
                UserId = "user1"
            };

            var result = await controller.PutRecipe(1, updated);

            Assert.IsType<NoContentResult>(result);
            Assert.Equal("Updated Title", context.Recipes.Find(1)?.Title);
        }
    }
}
