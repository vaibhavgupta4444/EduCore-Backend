using EduCore.Application.DTOs.Question;

namespace EduCore.Application.DTOs.Quiz;

public class QuizForStudentDto
{
    public Guid QuizId { get; set; }
    public string Title { get; set; }
    public int TimeLimitMinutes { get; set; }
    public List<QuestionForStudentDto> Questions { get; set; }
}