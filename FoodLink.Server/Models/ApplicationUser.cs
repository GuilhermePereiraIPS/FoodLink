using FoodLink.Server.Controllers;
using Microsoft.AspNetCore.Identity;

namespace FoodLink.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? AboutMe { get; set; }
        public Recipe[]? Recipes { get; set; }


    }
}
