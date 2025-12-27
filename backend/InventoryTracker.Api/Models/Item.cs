using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryTracker.Api.Models
{
   public class Item
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;

    public int Quantity { get; set; } = 0;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Required]
    public int UserId { get; set; }
}
}