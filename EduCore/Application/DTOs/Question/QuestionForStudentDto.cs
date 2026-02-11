using EduCore.Domain.Enums;

namespace EduCore.Application.DTOs.Question;

public class QuestionForStudentDto
{
    public Guid QuestionId { get; set; }
    public string Text { get; set; }
    public QuestionType Type { get; set; }
    public List<OptionForStudentDto> Options { get; set; }
}