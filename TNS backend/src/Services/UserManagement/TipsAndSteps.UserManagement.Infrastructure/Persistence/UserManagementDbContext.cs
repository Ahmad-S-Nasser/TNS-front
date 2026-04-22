using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TipsAndSteps.Shared.Infrastructure.MongoDB;
using TipsAndSteps.UserManagement.Domain.Entities;

namespace TipsAndSteps.UserManagement.Infrastructure.Persistence;

public sealed class UserManagementDbContext : MongoDbContext
{
    public IMongoCollection<User>         Users         => WriteCollection<User>("users");
    public IMongoCollection<User>         UsersRead     => ReadCollection<User>("users");
    public IMongoCollection<ChildProfile> Children      => WriteCollection<ChildProfile>("children");
    public IMongoCollection<ChildProfile> ChildrenRead  => ReadCollection<ChildProfile>("children");
    public IMongoCollection<DoctorProfile> Doctors      => WriteCollection<DoctorProfile>("doctor_profiles");

    public UserManagementDbContext(IOptions<MongoDbSettings> options) : base(options) { }
}
