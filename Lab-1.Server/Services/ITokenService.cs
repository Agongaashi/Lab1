using Lab_1.Server.Models;

namespace Lab_1.Server.Services
{
    public interface ITokenService
    {
        string CreateAccessToken(User user);
        string CreateRefreshToken();
        System.Security.Claims.ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
