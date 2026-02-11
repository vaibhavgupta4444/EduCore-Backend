using System.ComponentModel.DataAnnotations;
using EduCore.Domain.Enums;

namespace EduCore.Application.DTOs.Question;

public class CreateQuestionDto
{
    [Required]
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    
    [Required]
    public Guid QuizId { get; set; }
    public List<CreateOptionDto> Options { get; set; }
}