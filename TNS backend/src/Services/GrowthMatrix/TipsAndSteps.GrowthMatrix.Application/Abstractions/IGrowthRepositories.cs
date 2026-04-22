using TipsAndSteps.GrowthMatrix.Domain.Entities;
using TipsAndSteps.GrowthMatrix.Domain.Enums;

namespace TipsAndSteps.GrowthMatrix.Application.Abstractions;

public interface IGrowthSkillRepository
{
    Task<IReadOnlyList<GrowthSkill>> GetByAgeGroupAsync(AgeGroup ageGroup, CancellationToken ct = default);
    Task<IReadOnlyList<GrowthSkill>> GetByCategoryAsync(GrowthCategory category, CancellationToken ct = default);
    Task<GrowthSkill?> FindByIdAsync(string id, CancellationToken ct = default);
    Task CreateAsync(GrowthSkill skill, CancellationToken ct = default);
}

public interface IGrowthAssessmentRepository
{
    Task CreateAsync(GrowthAssessment assessment, CancellationToken ct = default);
    Task<GrowthAssessment?> FindByIdAsync(string id, CancellationToken ct = default);
    Task<IReadOnlyList<GrowthAssessment>> GetByChildIdAsync(string childId, CancellationToken ct = default);
}

public interface IGrowthEventPublisher
{
    Task PublishAssessmentCompletedAsync(GrowthAssessment assessment, CancellationToken ct = default);
    Task PublishGrowthAlertAsync(string childId, string message, CancellationToken ct = default);
}
