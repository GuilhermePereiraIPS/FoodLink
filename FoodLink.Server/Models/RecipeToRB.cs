using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class RecipeToRB
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int IdRecipe { get; set; }

        [Required]
        public int IdRecipeBook { get; set; }
    }
}
