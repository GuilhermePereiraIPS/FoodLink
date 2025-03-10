using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class RecipeBook
    {
        [Key]
        public int IdRecipeBook { get; set; }

        [Required]
        public string? RecipeBookTitle { get; set; }

        [Required]
        public int UserId { get; set; }
    }
}
