using System.ComponentModel.DataAnnotations;

namespace EduCore.Application.DTOs.Quiz;

public class CreateQuizDto
{
    [Required]
    public string Title { get; set; } = String.Empty;
    [Required]
    public Guid CourseId { get; set; } = Guid.Empty;
    [Required]
    public int TimeLimitMinutes { get; set; } = int.MinValue;
}