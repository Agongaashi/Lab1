using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_1.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateeeeee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "OrderProducts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ProductName",
                table: "OrderProducts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "OrderProducts");

            migrationBuilder.DropColumn(
                name: "ProductName",
                table: "OrderProducts");
        }
    }
}
