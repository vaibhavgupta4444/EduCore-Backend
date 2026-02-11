namespace EduCore.Domain.Entities;

public class QuizAttempt : Base
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; }

    public Guid StudentId { get; set; }
    public User Student { get; set; }

    public int Score { get; set; }
    public int TotalQuestions { get; set; }
}