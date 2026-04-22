using Keycloak.AuthServices.Authentication;
using Keycloak.AuthServices.Authorization;
using Serilog;
using TipsAndSteps.Shared.Infrastructure;
using TipsAndSteps.Shared.Infrastructure.MongoDB;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration).Enrich.FromLogContext()
    .WriteTo.Console().WriteTo.Seq(ctx.Configuration["Seq:Url"] ?? "http://seq:80"));

builder.Services.AddKeycloakWebApiAuthentication(builder.Configuration);
builder.Services.AddKeycloakAuthorization(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSharedInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new() { Title = "Analytics Service", Version = "v1" }));

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "analytics" }));
app.Run();
