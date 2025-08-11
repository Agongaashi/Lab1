using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_1.Server.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // User
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        // Shipping Address
        public int ShippingAddressId { get; set; }
        [ForeignKey("ShippingAddressId")]
        public ShippingAddress ShippingAddress { get; set; } = null!;

        // Lidhja me OrderProducts
        public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();

        // Çmimi total
        public decimal TotalPrice { get; set; }
    }
}
