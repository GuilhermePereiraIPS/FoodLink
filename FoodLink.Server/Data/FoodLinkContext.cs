using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Models;

namespace FoodLink.Server.Data
{
    public class FoodLinkContext : DbContext
    {
        public FoodLinkContext(DbContextOptions<FoodLinkContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipe { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração inicial (seeding) de dados 
            modelBuilder.Entity<Recipe>().HasData(
                new Recipe { Id = 1 }
            );
        }
    }
}
