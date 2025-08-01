using System.ComponentModel.DataAnnotations;

namespace Lab_1.Server.Models.Admin
{
    public class Role
    {
        //public int Id { get; set; }
        [Key]
        public string RoleName { get; set; } = string.Empty;
    }
}
