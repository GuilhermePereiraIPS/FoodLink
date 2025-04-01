namespace FoodLink.Server.Services
{
    using Mailjet.Client;
    using Mailjet.Client.Resources;
    using Microsoft.Extensions.Options;
    using System.Threading.Tasks;

    public interface IEmailService
    {
        Task SendActivationEmailAsync(string email, string token);
    }

    public class MailjetEmailService : IEmailService
    {
        private readonly IMailjetClient _mailjetClient;
        private readonly MailjetSettings _settings;

        public MailjetEmailService(IMailjetClient mailjetClient, IOptions<MailjetSettings> settings)
        {
            _mailjetClient = mailjetClient;
            _settings = settings.Value;
        }

        public async Task SendActivationEmailAsync(string email, string token)
        {
            var activationLink = $"https://yourdomain.com/activate?token={token}";
            var request = new MailjetRequest { Resource = Send.Resource }
                .Property(Send.FromEmail, _settings.SenderEmail)
                .Property(Send.FromName, _settings.SenderName)
                .Property(Send.To, email)
                .Property(Send.Subject, "Activate Your Account")
                .Property(Send.HtmlPart, $"<h3>Welcome!</h3><p>Please activate your account by clicking <a href='{activationLink}'>here</a>.</p>");

            var response = await _mailjetClient.PostAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to send email: {response.StatusCode}");
            }
        }
    }
}
