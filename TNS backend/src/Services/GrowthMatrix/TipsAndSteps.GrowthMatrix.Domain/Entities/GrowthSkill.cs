using TipsAndSteps.GrowthMatrix.Domain.Enums;

namespace TipsAndSteps.GrowthMatrix.Domain.Entities;

/// <summary>A single assessable skill within a category (20+ total)</summary>
public sealed class GrowthSkill
{
    public string       Id          { get; set; } = Guid.NewGuid().ToString();
    public AgeGroup     AgeGroup    { get; set; }
    public GrowthCategory Category  { get; set; }
    public SkillType    SkillType   { get; set; }
    public string       NameAr      { get; set; } = string.Empty;
    public string       NameEn      { get; set; } = string.Empty;
    public string       DescriptionAr { get; set; } = string.Empty;
    public string       DescriptionEn { get; set; } = string.Empty;
    public decimal      Weight      { get; set; } = 1.0m;  // scoring weight
    public decimal?     MaxValue    { get; set; }           // for Numeric type
    public bool         IsActive    { get; set; } = true;
    public int          OrderIndex  { get; set; }
}
