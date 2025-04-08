using FoodLink.Server.Services;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Moq.Protected;


namespace FoodLink.tests
{
    public class PixabayServiceTests
    {
        [Fact]
        public async Task GetImageUrlAsync_ReturnsImageUrl_WhenHitsExist()
        {
            var responseJson = @"{
                ""hits"": [
                    { ""largeImageURL"": ""https://example.com/image1.jpg"" },
                    { ""largeImageURL"": ""https://example.com/image2.jpg"" }
                ]
            }";

            var mockHandler = new Mock<HttpMessageHandler>();
            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(responseJson, Encoding.UTF8, "application/json")
                });


            var httpClient = new HttpClient(mockHandler.Object);

            var options = Options.Create(new PixabaySettings { ApiKey = "fake-key" });

            var service = new PixabayService(httpClient, options);

            // Act
            var result = await service.GetImageUrlAsync("pizza");

            // Assert - should return the first image url if there are hits
            Assert.Equal("https://example.com/image1.jpg", result);
        }

        [Fact]
        public async Task GetImageUrlAsync_ReturnsNull_WhenNoHits()
        {
            // Arrange
            var responseJson = @"{ ""hits"": [] }";

            var mockHandler = new Mock<HttpMessageHandler>();
            mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(responseJson, Encoding.UTF8, "application/json")
                });

            var httpClient = new HttpClient(mockHandler.Object);

            var options = Options.Create(new PixabaySettings { ApiKey = "fake-key" });

            var service = new PixabayService(httpClient, options);

            // Act
            var result = await service.GetImageUrlAsync("broccoli");

            // Assert - should return null if no hits
            Assert.Null(result);
        }
    }
}
