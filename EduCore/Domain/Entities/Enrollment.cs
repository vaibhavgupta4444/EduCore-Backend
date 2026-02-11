using System.ComponentModel.DataAnnotations;

namespace EduCore.Domain.Entities;

public class Enrollment : Base
{
    [Required]
    public Guid StudentId { get; set; }
    public User Student { get; set; }

    [Required]
    public Guid CourseId { get; set; }
    public Course Course { get; set; }
}