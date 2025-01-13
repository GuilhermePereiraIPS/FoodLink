using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodLink.Server.Migrations
{
    /// <inheritdoc />
    public partial class initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Recipe",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Recipe",
                columns: new[] { "Id", "Description", "Ingredients", "Name", "StepByStep" },
                values: new object[] { 1, "desc1", "ing1", "name1", "step1" });
        }
    }
}
