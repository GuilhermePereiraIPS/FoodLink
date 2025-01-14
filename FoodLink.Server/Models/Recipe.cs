using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public string StepByStep { get; set; }

        [Required]
        public string Ingredients { get; set; }

        // Binary data for storing the image
       // public byte[] ImageData { get; set; }
    }

}
