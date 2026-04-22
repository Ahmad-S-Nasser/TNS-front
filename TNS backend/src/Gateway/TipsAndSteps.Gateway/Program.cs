using Keycloak.AuthServices.Authentication;
using Serilog;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ──────────────────────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .WriteTo.Seq(ctx.Configuration["Seq:Url"] ?? "http://localhost:6093"));

// ── Keycloak JWT Authentication ───────────────────────────────────────────────
builder.Services.AddKeycloakWebApiAuthentication(builder.Configuration);
builder.Services.AddAuthorization();

// ── YARP Reverse Proxy ────────────────────────────────────────────────────────
builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// ── OpenTelemetry ─────────────────────────────────────────────────────────────
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("tns-gateway"))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddConsoleExporter());

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(
        builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? ["http://localhost:3000"])
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "gateway" }));

app.Run();
