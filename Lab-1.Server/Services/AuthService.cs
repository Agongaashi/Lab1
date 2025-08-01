using Lab_1.Server.Models;
using Lab_1.Server.Services;

namespace Lab_1.Server.Services
{
    public class AuthService(IUserDataService userData, IPasswordHasher hasher, ITokenService tokenService) : IAuthService
    {
        private readonly IUserDataService _userData = userData;
        private readonly IPasswordHasher _hasher = hasher;
        private readonly ITokenService _tokenService = tokenService;

        public async Task<ServiceResponse<AuthResponse>> Register(RegisterRequest request)
        {
            if (await _userData.GetByEmailAsync(request.Email) != null)
                return new ServiceResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Email already exists"
                };

            // Merr rolin nga databaza sipas emrit të rolit
            var role = await _userData.GetRoleByNameAsync(request.RoleName);
            if (role == null)
            {
                return new ServiceResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Invalid role"
                };
            }

            var user = new User
            {
                Username = request.Username!,
                Email = request.Email,
                PasswordHash = _hasher.Hash(request.Password),
                RoleName = role.RoleName,
                Role = role

            };

            await _userData.AddUserAsync(user);

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = _tokenService.CreateRefreshToken();

            await _userData.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            });

            return new ServiceResponse<AuthResponse>
            {
                Data = new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                }
            };
        }

        public async Task<ServiceResponse<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _userData.GetByEmailAsync(request.Email);

            if (user == null || !_hasher.Verify(request.Password, user.PasswordHash))
            {
                return new ServiceResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Invalid credentials"
                };
            }

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = _tokenService.CreateRefreshToken();

            await _userData.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            });

            return new ServiceResponse<AuthResponse>
            {
                Data = new AuthResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                }
            };
        }

        public async Task<ServiceResponse<AuthResponse>> Refresh(RefreshRequest request)
        {
            var existing = await _userData.GetRefreshTokenAsync(request.RefreshToken);

            if (existing == null || existing.IsExpired)
            {
                return new ServiceResponse<AuthResponse>
                {
                    Success = false,
                    Message = "Invalid refresh token"
                };
            }

            var newAccessToken = _tokenService.CreateAccessToken(existing.User);
            var newRefreshToken = _tokenService.CreateRefreshToken();

            await _userData.RemoveRefreshTokenAsync(existing);

            await _userData.SaveRefreshTokenAsync(new RefreshToken
            {
                Token = newRefreshToken,
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = existing.UserId
            });

            return new ServiceResponse<AuthResponse>
            {
                Data = new AuthResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                }
            };
        }

        public async Task<ServiceResponse<string>> Logout(string refreshToken)
        {
            var existing = await _userData.GetRefreshTokenAsync(refreshToken);

            if (existing != null)
                await _userData.RemoveRefreshTokenAsync(existing);

            return new ServiceResponse<string>
            {
                Data = "Logged out"
            };
        }
    }
}
