using System.ComponentModel.DataAnnotations;

namespace EduCore.Domain.Entities;

public class Quiz : Base
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public Guid CourseId { get; set; }
    public Course Course { get; set; }

    public int TimeLimitMinutes { get; set; } = int.MaxValue;


    public ICollection<Question>? Questions { get; set; }
}