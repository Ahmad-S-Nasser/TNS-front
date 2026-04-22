using MediatR;
using TipsAndSteps.UserManagement.Application.Abstractions;
using TipsAndSteps.UserManagement.Domain.Entities;

namespace TipsAndSteps.UserManagement.Application.Commands.RegisterUser;

public sealed class RegisterUserHandler : IRequestHandler<RegisterUserCommand, RegisterUserResult>
{
    private readonly IKeycloakAdminClient _keycloak;
    private readonly IUserRepository      _userRepo;
    private readonly IUserEventPublisher  _eventPublisher;

    public RegisterUserHandler(
        IKeycloakAdminClient keycloak,
        IUserRepository userRepo,
        IUserEventPublisher eventPublisher)
    {
        _keycloak       = keycloak;
        _userRepo       = userRepo;
        _eventPublisher = eventPublisher;
    }

    public async Task<RegisterUserResult> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Create user in Keycloak + assign realm role
        var keycloakId = await _keycloak.CreateUserAsync(new KeycloakUserRequest
        {
            Email       = request.Email,
            Password    = request.Password,
            FirstName   = request.FirstName,
            LastName    = request.LastName,
            RealmRole   = request.Role.ToString().ToLower()
        }, cancellationToken);

        // 2. Mirror user to MongoDB (write primary)
        var user = new User
        {
            Id              = keycloakId,
            KeycloakId      = keycloakId,
            Email           = request.Email,
            FirstName       = request.FirstName,
            LastName        = request.LastName,
            PhoneNumber     = request.PhoneNumber,
            Role            = request.Role,
            GovernorateCode = request.GovernorateCode,
            PreferredLanguage = request.PreferredLanguage,
            CreatedAt       = DateTime.UtcNow,
            UpdatedAt       = DateTime.UtcNow
        };
        await _userRepo.CreateAsync(user, cancellationToken);

        // 3. Publish Kafka event for downstream services
        await _eventPublisher.PublishUserRegisteredAsync(user, cancellationToken);

        return new RegisterUserResult(
            user.Id,
            keycloakId,
            user.Email,
            user.Role.ToString());
    }
}
