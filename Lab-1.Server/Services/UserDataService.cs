using Lab_1.Server.Data;
using Lab_1.Server.Models;
using Lab_1.Server.Models.Admin;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Lab_1.Server.Services
{
    public class UserDataService : IUserDataService
    {
        private readonly AppDbContext _context;

        public UserDataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task SaveRefreshTokenAsync(RefreshToken token)
        {
            await _context.RefreshTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(r => r.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(r => r.Token == token);
        }

        public async Task RemoveRefreshTokenAsync(RefreshToken token)
        {
            _context.RefreshTokens.Remove(token);
            await _context.SaveChangesAsync();
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
        }

        public Task<Role> GetRoleByNameAsync(Role roleName)
        {
            throw new NotImplementedException();
        }
    }
}
