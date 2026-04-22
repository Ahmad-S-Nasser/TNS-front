using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TipsAndSteps.Content.Application.Commands.CreateArticle;
using TipsAndSteps.Content.Application.Queries.GetArticle;
using TipsAndSteps.Content.Domain.Enums;

namespace TipsAndSteps.Content.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ContentController : ControllerBase
{
    private readonly IMediator _mediator;
    public ContentController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(
        string id,
        [FromQuery] string lang = "ar",
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetArticleQuery(id, lang), ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin,superadmin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateArticleCommand command,
        CancellationToken ct)
    {
        var id = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpGet("section/{section}")]
    [Authorize]
    public IActionResult GetBySection(
        ContentSection section,
        [FromQuery] string lang = "ar",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => Ok(new { message = $"Articles for section {section} — implement via CQRS query" });
}
