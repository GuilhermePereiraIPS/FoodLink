using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection.Extensions;

using FoodLink.Server.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FoodLink.Tests.Integration
{
    internal class FoodLinkWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            //base.ConfigureWebHost(builder);
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<FoodLinkContext>));

                var connString = GetConnectionString();
                services.AddSqlServer<FoodLinkContext>(connString);

                // delete database if exists to start anew
                var dbContext = CreateDbContext(services);
                dbContext.Database.EnsureDeleted();
            });
        }

        private static string? GetConnectionString()
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<FoodLinkWebApplicationFactory>()
                .Build();

            var connString = configuration.GetConnectionString("FoodLink");
            return connString;
        }

        private static FoodLinkContext CreateDbContext(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<FoodLinkContext>();
            return dbContext;
        }
    }

}


