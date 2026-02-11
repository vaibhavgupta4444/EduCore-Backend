namespace EduCore.Application.DTOs.Quiz;

public class StudentAnswerDto
{
    public Guid QuestionId { get; set; }
    public Guid SelectedOptionId { get; set; } = Guid.Empty;
    public string TextAnswer { get; set; }  = string.Empty;
}