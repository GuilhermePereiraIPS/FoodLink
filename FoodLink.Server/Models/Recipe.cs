using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Ingredients { get; set; }
        public string? Instructions { get; set; }

        public DateTime CreateDate { get; set; }
    }
}
