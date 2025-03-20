using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class RecipeToRB
    {
        [Key]
        public int IdRecipeToRB { get; set; }

        [Required]
        public int IdRecipe { get; set; }

        [Required]
        public int IdRecipeBook { get; set; }
    }
}
