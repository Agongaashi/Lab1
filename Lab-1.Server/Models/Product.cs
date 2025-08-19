using Lab_1.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // Emri i file-it të imazhit (ruhet fizikisht në server)
    public string? ImageName { get; set; }

    // Foreign Key - Category
    public int CategoryId { get; set; }
    [ForeignKey("CategoryId")]
    public Category Category { get; set; } = null!;

   
    public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
}
