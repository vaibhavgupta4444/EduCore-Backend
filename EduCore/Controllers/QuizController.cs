using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EduCore.Application.Interfaces;
using EduCore.Application.DTOs.Quiz;
using System.Security.Claims;

namespace EduCore.Application.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly IQuizServices _service;

    public QuizController(IQuizServices service)
    {
        _service = service;
    }

    [Authorize(Roles = "Instructor")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateQuizDto dto)
    {
        var id = await _service.CreateQuizAsync(dto);
        return Ok(id);
    }

    [Authorize(Roles = "Instructor")]
    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(Guid courseId)
    {
        var quizzes = await _service.GetByCourseAsync(courseId);
        return Ok(quizzes);
    }
    
    [Authorize(Roles = "User")]
    [HttpGet("{quizId}/start")]
    public async Task<IActionResult> StartQuiz(Guid quizId)
    {
        var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var quiz = await _service.GetQuizForStudentAsync(quizId, studentId);
        return Ok(quiz);
    }
    
    
    [Authorize(Roles = "User")]
    [HttpPost("submit")]
    public async Task<IActionResult> Submit(SubmitQuizDto dto)
    {
        var studentId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var result = await _service.SubmitQuizAsync(dto, studentId);

        return Ok(result);
    }
}