using Lab_1.Server.Data;
using Lab_1.Server.Models.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_1.Server.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/roles")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // Marr të gjitha rolet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // Shto rol të ri
        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] Role role)
        {
            if (await _context.Roles.AnyAsync(r => r.RoleName == role.RoleName))
                return BadRequest("Role already exists.");

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return Ok(role);
        }

        // Fshi rol
        [HttpDelete("{roleName}")]
        public async Task<IActionResult> DeleteRole(string roleName)
        {
            var role = await _context.Roles.FindAsync(roleName);
            if (role == null) return NotFound();

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Ndrysho rolin e përdoruesit
        // PUT api/admin/roles/change-user-role/{userId}
        [HttpPut("change-user-role/{userId}")]
        public async Task<IActionResult> ChangeUserRole(int userId, [FromBody] string newRoleName)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            var roleExists = await _context.Roles.AnyAsync(r => r.RoleName == newRoleName);
            if (!roleExists) return BadRequest("Role does not exist");

            user.RoleName = newRoleName;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully." });
        }
    }
}
