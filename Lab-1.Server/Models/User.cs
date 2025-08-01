using Lab_1.Server.Models.Admin;  // <--- importo Role
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Lab_1.Server.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // Foreign key for Role (mund te jete int ose string, varion sipas Role)
        public string RoleName { get; set; } = string.Empty;

        // Navigational property
        [ForeignKey("RoleName")]
        public Role Role { get; set; } = null!;
    }

}
