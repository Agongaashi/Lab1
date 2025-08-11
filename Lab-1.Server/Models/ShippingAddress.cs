using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_1.Server.Models
{
    public class ShippingAddress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string Street { get; set; } = string.Empty;
        public required string City { get; set; } = string.Empty;
        public required string Country { get; set; } = string.Empty;
        public required string PostalCode { get; set; } = string.Empty;

        // Foreign Key - User
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        // Navigational Property
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
