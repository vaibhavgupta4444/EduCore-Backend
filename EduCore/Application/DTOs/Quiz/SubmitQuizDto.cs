namespace EduCore.Application.DTOs.Quiz;

public class SubmitQuizDto
{
    public Guid QuizId { get; set; }
    public List<StudentAnswerDto> Answers { get; set; } = new();
}