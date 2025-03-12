using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace FoodLink.Server.Data
{
    public class FoodLinkContext : IdentityDbContext<ApplicationUser>
    {
        public FoodLinkContext(DbContextOptions<FoodLinkContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; } = default!;

        public DbSet<Comment> Comments { get; set; }
        public DbSet<RecipeBook> RecipeBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração inicial (seeding) de dados 
            modelBuilder.Entity<Recipe>().HasData(
                new Recipe { Id = 1, Title = "bruh"}
            );
        }
    }
}
