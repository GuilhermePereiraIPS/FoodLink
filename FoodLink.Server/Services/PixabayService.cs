using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace FoodLink.Server.Services
{
    public class PixabaySettings
    {
        public string ApiKey { get; set; }
    }

    public interface IPixabayService
    {
        Task<string?> GetImageUrlAsync(string searchQuery);
    }

    public class PixabayService : IPixabayService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public PixabayService(HttpClient httpClient, IOptions<PixabaySettings> pixabaySettings)
        {
            _httpClient = httpClient;
            _apiKey = pixabaySettings.Value.ApiKey;
        }

        public async Task<string?> GetImageUrlAsync(string searchQuery)
        {
            
            var url = $"https://pixabay.com/api/?key={_apiKey}&q={Uri.EscapeDataString(searchQuery)}&category=food&image_type=photo&safesearch=true";

            
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            // json parse
            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            // get first image URL (largeImageURL)
            var hits = root.GetProperty("hits");
            if (hits.GetArrayLength() > 0)
            {
                return hits[0].GetProperty("largeImageURL").GetString();
            }

            return null;
        }
    }
}
