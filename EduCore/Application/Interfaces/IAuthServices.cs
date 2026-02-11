using EduCore.Application.DTOs.Auth;

namespace EduCore.Application.Interfaces;
public interface IAuthServices
{
    Task<string> RegisterAsync(RegisterDto dto);
    Task<string> LoginAsync(LoginDto dto);
}