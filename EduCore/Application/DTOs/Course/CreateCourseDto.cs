using System.ComponentModel.DataAnnotations;
using EduCore.Domain.Enums;

namespace EduCore.Application.DTOs.Course;
public class CreateCourseDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string Category { get; set; } = string.Empty;

    public Difficulty Difficulty { get; set; } = Difficulty.Beginner;
    
    [Required]
    public int EstimatedDuration { get; set; }
    
    public string ThumbnailUrl { get; set; } = string.Empty;

    public CourseStatus CourseStatus { get; set; } = CourseStatus.Draft;
    
}