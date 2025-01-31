using Microsoft.EntityFrameworkCore;
using Nokta_API; // Namespace for AppDbContext and models

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
// Ensure the correct connection string is defined in appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers and Swagger/OpenAPI services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin() // Allows requests from any origin
               .AllowAnyMethod() // Allows all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader(); // Allows all headers
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline

// Enable Swagger for both Development and Production environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Nokta API v1");
    c.RoutePrefix = string.Empty; // Makes Swagger UI the root URL
});

// Enable the configured CORS policy
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization(); // Ensure authorization middleware is included if using authentication

// Map controllers
app.MapControllers();

app.Run();
