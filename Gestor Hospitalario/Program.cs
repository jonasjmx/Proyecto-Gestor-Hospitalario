using Gestor_Hospitalario.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuración de la conexión a la base de datos
builder.Services.AddDbContext<HospitalContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("MySqlConnection"),
        new MySqlServerVersion(new Version(8, 0, 42)))
);

// Habilitar CORS para permitir conexiones desde el frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Servicios de la API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplicar configuración de CORS antes de manejar solicitudes
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();