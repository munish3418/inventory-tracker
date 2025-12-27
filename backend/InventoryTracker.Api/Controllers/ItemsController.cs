using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using InventoryTracker.Api.Data;
using InventoryTracker.Api.Models;

namespace InventoryTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔐 JWT REQUIRED
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/items
        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            int userId = GetUserIdFromToken();

            var items = await _context.Items
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/items
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] Item item)
        {
            item.UserId = GetUserIdFromToken();
            item.Timestamp = DateTime.UtcNow;

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        // PUT: api/items/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
        {
            int userId = GetUserIdFromToken();

            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (item == null) return NotFound();

            item.Name = updatedItem.Name;
            item.Quantity = updatedItem.Quantity;
            item.Timestamp = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/items/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            int userId = GetUserIdFromToken();

            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (item == null) return NotFound();

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔐 Helper
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim!.Value);
        }
    }
}