using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using InventoryTracker.Api.Data;
using InventoryTracker.Api.Models;
using InventoryTracker.Api.Services.AI;

namespace InventoryTracker.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔐 JWT REQUIRED
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAiService _aiService;
        public ItemsController(AppDbContext context, IAiService aiService)
        {
            _context = context;
            _aiService = aiService;
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
             // 🧠 AI logic
            if (item.Quantity <= 0)
             {
                   item.Quantity = await _aiService.SuggestQuantityAsync(item.Name, item.UserId);
                   Console.WriteLine($"[AI] Quantity suggested for {item.Name}");
             }

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
            return Ok(item);
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
        [HttpGet("suggest-quantity")]
        public async Task<IActionResult> SuggestQuantity([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Item name required");

            int userId = GetUserIdFromToken();

            int quantity = await _aiService.SuggestQuantityAsync(name, userId);

            return Ok(new { quantity });
        }
        // 🔐 Helper
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim!.Value);
        }
    }
}