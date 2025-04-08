using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using FoodLink.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;

public class UserAccountsControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly FoodLinkContext _context;
    private readonly UserAccountsController _controller;

    public UserAccountsControllerTests()
    {
        // Mock UserManager
        var userStore = new Mock<IUserStore<ApplicationUser>>();
        var identityOptions = new Mock<Microsoft.Extensions.Options.IOptions<IdentityOptions>>();
        identityOptions.Setup(o => o.Value).Returns(new IdentityOptions());

        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStore.Object,
            identityOptions.Object,
            new Mock<IPasswordHasher<ApplicationUser>>().Object,
            new List<IUserValidator<ApplicationUser>>(),
            new List<IPasswordValidator<ApplicationUser>>(),
            new Mock<ILookupNormalizer>().Object,
            new IdentityErrorDescriber(),
            new Mock<IServiceProvider>().Object,
            new Mock<Microsoft.Extensions.Logging.ILogger<UserManager<ApplicationUser>>>().Object
        );

        _configurationMock = new Mock<IConfiguration>();

        var options = new DbContextOptionsBuilder<FoodLinkContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new FoodLinkContext(options);

        _controller = new UserAccountsController(_userManagerMock.Object, _configurationMock.Object, _context);
    }

    [Fact]
    public void GetAllUsers_ReturnsList()
    {
        var users = new List<ApplicationUser>
        {
            new ApplicationUser { Id = "1", UserName = "user1" },
            new ApplicationUser { Id = "2", UserName = "user2" }
        }.AsQueryable();

        _userManagerMock.Setup(u => u.Users).Returns(users);

        var result = _controller.GetAllUsers();
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);

        Assert.Equal(2, returned.Count());
    }
}
