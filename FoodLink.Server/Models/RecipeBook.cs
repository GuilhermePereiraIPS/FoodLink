using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class RecipeBook
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? RecipeBookTitle { get; set; }

        [Required]
        public string UserId { get; set; }

        public int RecipeAmount { get; set; }
    }
}
