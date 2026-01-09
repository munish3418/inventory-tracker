namespace InventoryTracker.Api.Services.AI
{
    public interface IAiService
    {
        Task<int> SuggestQuantityAsync(string itemName, int userId);
    }
}