using Lab_1.Server.Data;
using Lab_1.Server.Models;
using Lab_1.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .OrderBy(p => p.Id)
                .ToListAsync();

            // Shto full URL për imazhet për të shmangur probleme me path
            var baseUrl = $"{Request.Scheme}://{Request.Host}/images/";
            var result = products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.CategoryId,
                Category = p.Category,
                ImageUrl = string.IsNullOrEmpty(p.ImageName) ? null : baseUrl + p.ImageName
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            var baseUrl = $"{Request.Scheme}://{Request.Host}/images/";
            var result = new
            {
                product.Id,
                product.Name,
                product.Price,
                product.CategoryId,
                Category = product.Category,
                ImageUrl = string.IsNullOrEmpty(product.ImageName) ? null : baseUrl + product.ImageName
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Price <= 0 || dto.CategoryId <= 0)
                return BadRequest("Të dhënat e produktit janë të pavlefshme.");

            string? imageName = null;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(dto.Image.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Lejohet vetëm imazhe .jpg, .jpeg, .png, .gif");

                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                imageName = Guid.NewGuid() + extension;
                var filePath = Path.Combine(uploadsFolder, imageName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(fileStream);
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                ImageName = imageName
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Kthe produktin me URL të plotë të imazhit
            var baseUrl = $"{Request.Scheme}://{Request.Host}/images/";
            var createdProduct = new
            {
                product.Id,
                product.Name,
                product.Price,
                product.CategoryId,
                Category = await _context.Categories.FindAsync(product.CategoryId),
                ImageUrl = string.IsNullOrEmpty(product.ImageName) ? null : baseUrl + product.ImageName
            };

            return Ok(createdProduct);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductCreateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Price <= 0 || dto.CategoryId <= 0)
                return BadRequest("Të dhënat e produktit janë të pavlefshme.");

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(dto.Image.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Lejohet vetëm imazhe .jpg, .jpeg, .png, .gif");

                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Fshij imazhin e vjetër nëse ekziston
                if (!string.IsNullOrEmpty(product.ImageName))
                {
                    var oldPath = Path.Combine(uploadsFolder, product.ImageName);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var imageName = Guid.NewGuid() + extension;
                var filePath = Path.Combine(uploadsFolder, imageName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(fileStream);

                product.ImageName = imageName;
            }

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.ImageName))
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "images");
                var path = Path.Combine(uploadsFolder, product.ImageName);
                if (System.IO.File.Exists(path))
                    System.IO.File.Delete(path);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
