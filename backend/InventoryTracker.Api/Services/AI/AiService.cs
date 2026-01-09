using InventoryTracker.Api.Services.AI;

namespace InventoryTracker.Api.Services.AI
{
    public class AiService : IAiService
    {
        public Task<int> SuggestQuantityAsync(string itemName, int userId)
        {
            // 🔹 Simple AI-like rules (temporary)
            itemName = itemName.ToLower();

            int quantity = itemName switch
            {
                var x when x.Contains("milk") => 2,
                var x when x.Contains("rice") => 5,
                var x when x.Contains("apple") => 6,
                var x when x.Contains("pen") => 10,
                _ => 1
            };

            return Task.FromResult(quantity);
        }
    }
}