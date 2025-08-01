using Lab_1.Server.Models;
using Lab_1.Server.Models.Admin;
using System.Threading.Tasks;

namespace Lab_1.Server.Services
{
    public interface IUserDataService
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task AddUserAsync(User user);
        Task SaveRefreshTokenAsync(RefreshToken token);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task RemoveRefreshTokenAsync(RefreshToken token);

        // Shto këtë metodë
        Task<Role?> GetRoleByNameAsync(string roleName);
        Task<Role> GetRoleByNameAsync(Role roleName);
    }
}
