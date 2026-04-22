using FluentValidation;
using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using MediatR;
using Serilog;
using TipsAndSteps.UserManagement.Application.Commands.RegisterUser;
using TipsAndSteps.UserManagement.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ──────────────────────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Seq(ctx.Configuration["Seq:Url"] ?? "http://seq:80"));

// ── MediatR + FluentValidation ────────────────────────────────────────────────
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(
    typeof(RegisterUserHandler).Assembly));
builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserValidator>();

// ── Keycloak Auth ─────────────────────────────────────────────────────────────
builder.Services.AddKeycloakWebApiAuthentication(builder.Configuration);
builder.Services.AddKeycloakAuthorization(builder.Configuration);
builder.Services.AddAuthorization();

// ── Infrastructure ────────────────────────────────────────────────────────────
builder.Services.AddUserManagementInfrastructure(builder.Configuration);

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "UserManagement Service", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Type   = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "usermgmt" }));

app.Run();
