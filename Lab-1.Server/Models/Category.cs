using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_1.Server.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string Name { get; set; } = string.Empty;

        // Navigational Property
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
