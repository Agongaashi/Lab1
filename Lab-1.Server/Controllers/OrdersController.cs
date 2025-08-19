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
    [Authorize]
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null) return Unauthorized();

            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .AsQueryable();

            if (userRoleClaim != "Admin")
            {
                query = query.Where(o => o.UserId == int.Parse(userIdClaim));
            }

            var orders = await query.OrderBy(o => o.Id).ToListAsync();

            var dto = orders.Select(o => new
            {
                OrderId = o.Id,
                o.OrderDate,
                o.TotalPrice,
                UserId = o.UserId,
                UserName = o.User.Username,
                ShippingAddressId = o.ShippingAddressId,
                ShippingStreet = o.ShippingAddress.Street,
                ShippingCity = o.ShippingAddress.City,
                ShippingCountry = o.ShippingAddress.Country,
                ShippingPostalCode = o.ShippingAddress.PostalCode,
                Products = o.OrderProducts.Select(op => new
                {
                    op.ProductId,
                    name = op.ProductName,
                    quantity = op.Quantity,
                    unitPrice = op.UnitPrice,
                    imageUrl = string.IsNullOrEmpty(op.ImageUrl)
         ? "/images/default.png"
         : (op.ImageUrl.StartsWith("http")
             ? op.ImageUrl
             : $"/images/{op.ImageUrl}")
                }).ToList()


            });

            return Ok(dto);
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JsonElement dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            if (!dto.TryGetProperty("shippingAddress", out var shippingAddressProp) ||
                !dto.TryGetProperty("items", out var itemsProp) ||
                !dto.TryGetProperty("totalPrice", out var totalProp))
            {
                return BadRequest("Të dhëna të paplota për porosinë.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // ✅ Ruajmë adresën vetëm gjatë Checkout
                var shippingAddress = new ShippingAddress
                {
                    Street = shippingAddressProp.GetProperty("street").GetString() ?? "",
                    City = shippingAddressProp.GetProperty("city").GetString() ?? "",
                    Country = shippingAddressProp.GetProperty("country").GetString() ?? "",
                    PostalCode = shippingAddressProp.GetProperty("postalCode").GetString() ?? "",
                    UserId = int.Parse(userIdClaim)
                };

                _context.ShippingAddresses.Add(shippingAddress);
                await _context.SaveChangesAsync();

                var order = new Order
                {
                    UserId = int.Parse(userIdClaim),
                    ShippingAddressId = shippingAddress.Id,
                    TotalPrice = totalProp.GetDecimal(),
                    OrderDate = DateTime.UtcNow,
                    OrderProducts = new List<OrderProduct>()
                };

                foreach (var item in itemsProp.EnumerateArray())
                {
                    int productId = item.GetProperty("productId").GetInt32();
                    int quantity = item.GetProperty("quantity").GetInt32();
                    decimal unitPrice = item.GetProperty("unitPrice").GetDecimal();
                    string imageUrl = item.TryGetProperty("imageUrl", out var imgProp) ? imgProp.GetString() ?? "" : "";
                    string name = item.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? "" : "";

                    var product = await _context.Products.FindAsync(productId);

                    order.OrderProducts.Add(new OrderProduct
                    {
                        ProductId = productId,
                        Quantity = quantity,
                        UnitPrice = unitPrice,
                        ProductName = !string.IsNullOrEmpty(name) ? name : (product?.Name ?? ""),
                        ImageUrl = !string.IsNullOrEmpty(imageUrl) ? imageUrl : (product?.ImageName ?? "")
                    });
                }

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { OrderId = order.Id, Message = "Porosia u krijua me sukses" });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // DELETE: api/Orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userIdClaim == null) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            if (userRoleClaim != "Admin" && order.UserId != int.Parse(userIdClaim))
                return Forbid();

            var shippingAddressId = order.ShippingAddressId;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            var isAddressUsed = await _context.Orders.AnyAsync(o => o.ShippingAddressId == shippingAddressId);
            if (!isAddressUsed)
            {
                var address = await _context.ShippingAddresses.FindAsync(shippingAddressId);
                if (address != null)
                {
                    _context.ShippingAddresses.Remove(address);
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }
    }
}
