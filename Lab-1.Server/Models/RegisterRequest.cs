using Lab_1.Server.Models.Admin;

namespace Lab_1.Server.Models
{
    public class RegisterRequest
    {
        public string? Username { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        //public int RoleId { get; set; }  
        public string RoleName { get; set; } = null!;
    }
}
