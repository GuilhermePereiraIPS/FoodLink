using FoodLink.Server.Models;

namespace FoodLink.Server.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
