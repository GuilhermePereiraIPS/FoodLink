using Microsoft.EntityFrameworkCore;
using FoodLink.Server.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FoodLink.Server.Models;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;


// Add services to the container.
builder.Services.AddDbContext<FoodLinkContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FoodLinkContext") ?? throw new InvalidOperationException("Connection string 'FoodLinkContext' not found.")));

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<FoodLinkContext>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    // Configuração de autenticação no Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insere o token JWT no campo 'Authorization' como: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

app.MapIdentityApi<AppUser>();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();



app.MapFallbackToFile("/index.html");

app.Run();
