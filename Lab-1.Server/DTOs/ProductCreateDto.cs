namespace Lab_1.Server.Dtos
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }

        // File i imazhit i ri
        public IFormFile? Image { get; set; }
    }
}
