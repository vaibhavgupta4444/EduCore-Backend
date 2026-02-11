namespace EduCore.Domain.Entities;

public class Base
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid CreatedBy { get; set; } = Guid.Empty;
    public Guid UpdatedBy { get; set; } = Guid.Empty;
}