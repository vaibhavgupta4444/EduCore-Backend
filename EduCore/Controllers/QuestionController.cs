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
    
    [HttpPost("bulk-upload/{quizId}")]
    [Authorize(Roles = "Instructor")]
    public async Task<IActionResult> BulkUpload(Guid quizId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is required.");

        var result = await _service.UploadQuestionsAsync(file, quizId);

        return Ok(result);
    }

}
