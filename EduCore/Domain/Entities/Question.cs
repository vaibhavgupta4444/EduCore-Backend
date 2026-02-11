using EduCore.Domain.Enums;

namespace EduCore.Domain.Entities;

public class Question : Base
{

    public string Text { get; set; } = string.Empty;

    public QuestionType Type { get; set; }

    public bool IsActive { get; set; } = true;

    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; }

    public ICollection<QuestionOption>? Options { get; set; }
}
