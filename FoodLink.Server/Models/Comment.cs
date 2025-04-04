using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? CommentText { get; set; }

        [Required]
        public int RecipeId { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
