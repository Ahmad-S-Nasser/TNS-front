using MediatR;
using TipsAndSteps.Content.Domain.Enums;

namespace TipsAndSteps.Content.Application.Commands.CreateArticle;

public sealed record CreateArticleCommand(
    ContentSection Section,
    ContentType    Type,
    string         TitleAr,
    string         TitleEn,
    string         BodyAr,
    string         BodyEn,
    string?        SummaryAr,
    string?        SummaryEn,
    string?        ThumbnailUrl,
    string?        VideoUrl,
    List<string>   Tags,
    int            MinAgeMonths,
    int            MaxAgeMonths,
    string         AuthorId
) : IRequest<string>; // returns new article ID
