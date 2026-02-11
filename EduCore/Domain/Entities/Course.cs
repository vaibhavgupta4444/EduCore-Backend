using System.ComponentModel.DataAnnotations;
using EduCore.Domain.Enums;

namespace EduCore.Domain.Entities;

public class Course : Base
{
    [Required]
    public string Title { get; set; } = String.Empty;
    
    [Required]
    public string Description { get; set; } = String.Empty;
    
    [Required]
    public string Category { get; set; } = String.Empty;
    
    
    public Difficulty Difficulty { get; set; } = Difficulty.Beginner;
    public int EstimatedDuration { get; set; } = 0;
    public CourseStatus CourseStatus { get; set; } = CourseStatus.Draft;
    public string Thumbnail { get; set; } = String.Empty;
    
    [Required]
    public Guid InstructorId { get; set; } = Guid.Empty;
    public User Instructor { get; set; }

    public ICollection<Enrollment>? Enrollments { get; set; }
    public ICollection<Quiz>? Quizzes { get; set; }
}