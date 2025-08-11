namespace Lab_1.Server.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }

        public int UserId { get; set; }
        public string? UserName { get; set; }

        public int ShippingAddressId { get; set; }
        public string? ShippingStreet { get; set; }
        public string? ShippingCity { get; set; }

        public string ProductsJson { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
    }
}
