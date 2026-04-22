using MediatR;
using TipsAndSteps.Content.Application.Abstractions;
using TipsAndSteps.Content.Domain.Entities;

namespace TipsAndSteps.Content.Application.Commands.CreateArticle;

public sealed class CreateArticleHandler : IRequestHandler<CreateArticleCommand, string>
{
    private readonly IContentRepository     _repo;
    private readonly IContentEventPublisher _events;

    public CreateArticleHandler(IContentRepository repo, IContentEventPublisher events)
        => (_repo, _events) = (repo, events);

    public async Task<string> Handle(CreateArticleCommand request, CancellationToken ct)
    {
        var article = new ContentArticle
        {
            Section      = request.Section,
            Type         = request.Type,
            TitleAr      = request.TitleAr,
            TitleEn      = request.TitleEn,
            BodyAr       = request.BodyAr,
            BodyEn       = request.BodyEn,
            SummaryAr    = request.SummaryAr,
            SummaryEn    = request.SummaryEn,
            ThumbnailUrl = request.ThumbnailUrl,
            VideoUrl     = request.VideoUrl,
            Tags         = request.Tags,
            MinAgeMonths = request.MinAgeMonths,
            MaxAgeMonths = request.MaxAgeMonths,
            AuthorId     = request.AuthorId
        };

        await _repo.CreateAsync(article, ct);
        return article.Id;
    }
}
