using Lab_1.Server.Models;
using System.Threading.Tasks;

namespace Lab_1.Server.Services
{
    public interface IAuthService
    {
        Task<ServiceResponse<AuthResponse>> Register(RegisterRequest request);
        Task<ServiceResponse<AuthResponse>> Login(LoginRequest request);
        Task<ServiceResponse<AuthResponse>> Refresh(RefreshRequest request);
        Task<ServiceResponse<string>> Logout(string refreshToken);
    }
}
