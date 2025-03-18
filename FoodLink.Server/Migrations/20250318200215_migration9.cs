using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodLink.Server.Migrations
{
    /// <inheritdoc />
    public partial class migration9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecipeToRB",
                columns: table => new
                {
                    IdRecipeToRB = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdRecipe = table.Column<int>(type: "int", nullable: false),
                    IdRecipeBook = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeToRB", x => x.IdRecipeToRB);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeToRB");
        }
    }
}
