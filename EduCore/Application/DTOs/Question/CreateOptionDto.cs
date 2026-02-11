using System.ComponentModel.DataAnnotations;

namespace EduCore.Application.DTOs.Question;

public class CreateOptionDto
{
    [Required]
    public string Text { get; set; } = string.Empty;
    [Required]
    public bool IsCorrect { get; set; } = false;
}