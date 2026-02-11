using System.ComponentModel.DataAnnotations;
using EduCore.Domain.Enums;

namespace EduCore.Application.DTOs.Auth;

public class RegisterDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    public Role Role { get; set; } = Role.User;
}