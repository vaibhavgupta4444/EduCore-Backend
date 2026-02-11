using EduCore.Application.Interfaces;
using EduCore.Application.DTOs.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduCore.Controllers;
[Authorize(Roles = "Instructor,Admin")]
[ApiController]
[Route("api/[controller]")]
public class QuestionController : ControllerBase
{
    private readonly IQuestionServices _service;

    public QuestionController(IQuestionServices service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateQuestionDto dto)
    {
        var id = await _service.CreateQuestionAsync(dto);
        return Ok(id);
    }
}
