namespace EduCore.Application.DTOs.Quiz;

public class QuizResultDto
{
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public bool Passed { get; set; }
}