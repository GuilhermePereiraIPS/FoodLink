using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
    }
}
