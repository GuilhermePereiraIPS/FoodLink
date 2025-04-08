namespace FoodLink.Server.Services
{
    using Mailjet.Client;
    using Mailjet.Client.Resources;
    using Microsoft.Extensions.Options;
    using Resend;
    using System.Threading.Tasks;


    public class ResendService
    {
        private readonly IResend _resend;


        public ResendService(IResend resend)
        {
            _resend = resend;
        }


        public async Task Execute()
        {
            var message = new EmailMessage();
            message.From = "onboarding@resend.dev";
            message.To.Add("202001403@estudantes.ips.pt");
            message.Subject = "hello world";
            message.HtmlBody = "<strong>it works!</strong>";

            await _resend.EmailSendAsync(message);
        }
    }
}
