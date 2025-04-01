using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FoodLink.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? UserId { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        public ApplicationUser? User { get; set; }

        [Required]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Ingredients { get; set; }
        public string? Instructions { get; set; }

        public DateTime CreateDate { get; set; }
        public string? ImageUrl { get; set; }
    }
}
