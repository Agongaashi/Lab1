using Lab_1.Server.Data;
using Lab_1.Server.Dtos;
using Lab_1.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Lab_1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShippingAddressesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ShippingAddressesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(ShippingAddressCreateDto dto)
        {
            // Merr ID-në e përdoruesit nga token-i JWT me ClaimTypes.NameIdentifier
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var address = new ShippingAddress
            {
                Street = dto.Street,
                City = dto.City,
                Country = dto.Country,
                PostalCode = dto.PostalCode,
                UserId = int.Parse(userIdClaim)
            };

            _context.ShippingAddresses.Add(address);
            await _context.SaveChangesAsync();

            var createdAddress = await _context.ShippingAddresses
                .Include(sa => sa.User)
                .FirstOrDefaultAsync(sa => sa.Id == address.Id);

            return Ok(createdAddress);
        }
    }
}
