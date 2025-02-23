using System.ComponentModel.DataAnnotations;

namespace FoodLink.Server.Models
{
    public class Comment
    {
        [Key]
        public int IdComment { get; set; }

        [Required]
        public string? CommentText { get; set; }
        public int RecipeId { get; set; }
        public int UserId { get; set; }
    }
}
