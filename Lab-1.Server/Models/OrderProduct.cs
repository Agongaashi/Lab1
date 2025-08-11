using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_1.Server.Models
{
    public class OrderProduct
    {
        [Key]
        public int Id { get; set; }

        // Lidhja me Order
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; } = null!;

        // Lidhja me Product
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!;

        // Sasia e porositur
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
