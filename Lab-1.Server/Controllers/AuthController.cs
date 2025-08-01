using Lab_1.Server.Models;
using Lab_1.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Lab_1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.Register(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.Login(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var response = await _authService.Refresh(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
        {
            var response = await _authService.Logout(request.RefreshToken);
            return Ok(response);
        }
    }
}
