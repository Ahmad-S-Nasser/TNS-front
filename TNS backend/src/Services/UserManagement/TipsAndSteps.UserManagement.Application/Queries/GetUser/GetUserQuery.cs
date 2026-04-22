using MediatR;

namespace TipsAndSteps.UserManagement.Application.Queries.GetUser;

public sealed record GetUserQuery(string UserId) : IRequest<UserDto?>;

public sealed record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Role,
    string? GovernorateCode,
    string PreferredLanguage,
    bool IsActive,
    bool IsVerified,
    DateTime CreatedAt);
