using System.ComponentModel.DataAnnotations;

namespace EduCore.Domain.Entities;

public class QuestionOption : Base
{
    [Required]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; } = false;

    [Required]
    public Guid QuestionId { get; set; }
    public Question Question { get; set; }
}
