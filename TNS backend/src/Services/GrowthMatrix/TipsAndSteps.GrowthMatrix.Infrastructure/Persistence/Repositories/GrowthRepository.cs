using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TipsAndSteps.GrowthMatrix.Application.Abstractions;
using TipsAndSteps.GrowthMatrix.Domain.Entities;
using TipsAndSteps.GrowthMatrix.Domain.Enums;
using TipsAndSteps.Shared.Infrastructure.MongoDB;

namespace TipsAndSteps.GrowthMatrix.Infrastructure.Persistence.Repositories;

public sealed class GrowthDbContext : MongoDbContext
{
    public IMongoCollection<GrowthSkill>      Skills      => WriteCollection<GrowthSkill>("growth_skills");
    public IMongoCollection<GrowthSkill>      SkillsRead  => ReadCollection<GrowthSkill>("growth_skills");
    public IMongoCollection<GrowthAssessment> Assessments => WriteCollection<GrowthAssessment>("assessments");
    public IMongoCollection<GrowthAssessment> AssessmentsRead => ReadCollection<GrowthAssessment>("assessments");

    public GrowthDbContext(IOptions<MongoDbSettings> options) : base(options) { }
}

public sealed class GrowthSkillRepository : IGrowthSkillRepository
{
    private readonly GrowthDbContext _ctx;
    public GrowthSkillRepository(GrowthDbContext ctx) => _ctx = ctx;

    public async Task<IReadOnlyList<GrowthSkill>> GetByAgeGroupAsync(AgeGroup ageGroup, CancellationToken ct = default)
        => await _ctx.Skills.Find(s => s.AgeGroup == ageGroup && s.IsActive)
                             .SortBy(s => s.OrderIndex).ToListAsync(ct);

    public async Task<IReadOnlyList<GrowthSkill>> GetByCategoryAsync(GrowthCategory category, CancellationToken ct = default)
        => await _ctx.Skills.Find(s => s.Category == category && s.IsActive).ToListAsync(ct);

    public async Task<GrowthSkill?> FindByIdAsync(string id, CancellationToken ct = default)
        => await _ctx.Skills.Find(s => s.Id == id).FirstOrDefaultAsync(ct);

    public Task CreateAsync(GrowthSkill skill, CancellationToken ct = default)
        => _ctx.Skills.InsertOneAsync(skill, cancellationToken: ct);
}

public sealed class GrowthAssessmentRepository : IGrowthAssessmentRepository
{
    private readonly GrowthDbContext _ctx;
    public GrowthAssessmentRepository(GrowthDbContext ctx) => _ctx = ctx;

    public Task CreateAsync(GrowthAssessment assessment, CancellationToken ct = default)
        => _ctx.Assessments.InsertOneAsync(assessment, cancellationToken: ct);

    public async Task<GrowthAssessment?> FindByIdAsync(string id, CancellationToken ct = default)
        => await _ctx.Assessments.Find(a => a.Id == id).FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<GrowthAssessment>> GetByChildIdAsync(string childId, CancellationToken ct = default)
        => await _ctx.AssessmentsRead
                     .Find(a => a.ChildId == childId)
                     .SortByDescending(a => a.CompletedAt)
                     .ToListAsync(ct);
}
