using System.ComponentModel.DataAnnotations;
using EduCore.Domain.Enums;

namespace EduCore.Domain.Entities;

public class User : Base
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
    
    public Role Role { get; set; } = Role.User;
    
    public ICollection<Enrollment>? Enrollments { get; set; }
    public ICollection<Course>? CreatedCourses { get; set; }
}