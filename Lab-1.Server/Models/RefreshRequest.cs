namespace Lab_1.Server.Models
{
    public class RefreshRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}
