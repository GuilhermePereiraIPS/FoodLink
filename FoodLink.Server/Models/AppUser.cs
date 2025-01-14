using Microsoft.AspNetCore.Identity;

namespace FoodLink.Server.Models
{
    public class AppUser : IdentityUser
    {
        [PersonalData]
        public string Name { get; set; }
    }
}
