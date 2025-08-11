using System.Text.Json;
using Lab_1.Server.Data;
using Lab_1.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Lab_1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Lejon çdo përdorues të kyçur të bëjë porosi
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderProducts)
                    .ThenInclude(op => op.Product)
                .ToListAsync();

            var dto = orders.Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalPrice,
                o.UserId,
                UserName = o.User.Username,
                o.ShippingAddressId,
                ShippingStreet = o.ShippingAddress.Street,
                ShippingCity = o.ShippingAddress.City,
                Products = o.OrderProducts.Select(op => new
                {
                    op.ProductId,
                    ProductName = op.Product.Name,
                    op.Quantity,
                    op.UnitPrice
                }).ToList()
            });

            return Ok(dto);
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JsonElement dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            if (!dto.TryGetProperty("shippingAddressId", out var shippingIdProp) ||
                !dto.TryGetProperty("items", out var itemsProp) ||
                !dto.TryGetProperty("totalPrice", out var totalProp))
            {
                return BadRequest("Të dhëna të paplota për porosinë.");
            }

            var order = new Order
            {
                UserId = int.Parse(userIdClaim),
                ShippingAddressId = shippingIdProp.GetInt32(),
                TotalPrice = totalProp.GetDecimal(),
                OrderDate = DateTime.UtcNow,
                OrderProducts = new List<OrderProduct>()
            };

            // Lexojmë produktet nga 'items'
            foreach (var item in itemsProp.EnumerateArray())
            {
                if (!item.TryGetProperty("productId", out var productIdProp) ||
                    !item.TryGetProperty("quantity", out var quantityProp) ||
                    !item.TryGetProperty("unitPrice", out var unitPriceProp))
                {
                    return BadRequest("Produkte të paplota në porosi.");
                }

                var orderProduct = new OrderProduct
                {
                    ProductId = productIdProp.GetInt32(),
                    Quantity = quantityProp.GetInt32(),
                    UnitPrice = unitPriceProp.GetDecimal()
                };

                order.OrderProducts.Add(orderProduct);
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { order.Id });
        }

        // DELETE: api/Orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound();

            if (order.UserId != int.Parse(userIdClaim))
                return Forbid();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
