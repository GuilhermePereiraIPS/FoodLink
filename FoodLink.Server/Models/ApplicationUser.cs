using Microsoft.AspNetCore.Identity;

namespace FoodLink.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        [PersonalData]
        public string Name { get; set; }
    }
}
