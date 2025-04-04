#nullable disable
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using FoodLink.Server.Controllers;
using FoodLink.Server.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

public class UserAccountsControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly UserAccountsController _controller;

    public UserAccountsControllerTests()
    {
        var userStore = new Mock<IUserStore<ApplicationUser>>();
        var identityOptions = new Mock<Microsoft.Extensions.Options.IOptions<IdentityOptions>>();
        identityOptions.Setup(o => o.Value).Returns(new IdentityOptions());

        var passwordHasher = new Mock<IPasswordHasher<ApplicationUser>>();
        var userValidators = new List<IUserValidator<ApplicationUser>>();
        var passwordValidators = new List<IPasswordValidator<ApplicationUser>>();
        var normalizer = new Mock<ILookupNormalizer>();
        var describer = new IdentityErrorDescriber();
        var services = new Mock<IServiceProvider>();
        var logger = new Mock<Microsoft.Extensions.Logging.ILogger<UserManager<ApplicationUser>>>();

        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStore.Object,
            identityOptions.Object,
            passwordHasher.Object,
            userValidators,
            passwordValidators,
            normalizer.Object,
            describer,
            services.Object,
            logger.Object
        );

        _configurationMock = new Mock<IConfiguration>();
        _controller = new UserAccountsController(_userManagerMock.Object, _configurationMock.Object);
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
