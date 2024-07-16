using Microsoft.AspNetCore.Http;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Application
{
    public static class Utils
    {
        public static async Task<IFormFile> PhotoToFile(string fileBase64)
        {
            // Initialize HttpClient
            using var httpClient = new HttpClient();

            // Download image data from the URL
            byte[] imageBytes = await httpClient.GetByteArrayAsync(fileBase64);

            // Create a memory stream from the downloaded data
            var ms = new MemoryStream(imageBytes);

            // Extract file name from URL
            string fileName = Path.GetFileName(fileBase64);

            // Create an instance of FormFile
            var formFile = new FormFile(ms, 0, ms.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpeg" // Adjust the content type based on your image
            };

            return formFile;
        }
    }
}
