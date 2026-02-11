using Microsoft.AspNetCore.Mvc;
using EduCore.Application.Interfaces;
using EduCore.Application.DTOs.Auth;

namespace EduCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthServices _authService;

    public AuthController(IAuthServices authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return Ok(new { success = true, message = result });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
        return Ok(new { success = true, token });
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { 
            success = true, 
            message = "Backend connection successful!", 
            timestamp = DateTime.Now,
            server = "EduCore API"
        });
    }
}