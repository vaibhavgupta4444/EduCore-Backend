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
        try
        {
            var id = await _service.CreateQuestionAsync(dto);
            return Ok(id);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("quiz/{quizId}")]
    public async Task<IActionResult> GetByQuiz(Guid quizId)
    {
        var questions = await _service.GetByQuizAsync(quizId);
        return Ok(questions);
    }

    [HttpPut("{questionId}")]
    public async Task<IActionResult> Update(Guid questionId, CreateQuestionDto dto)
    {
        try
        {
            var question = await _service.UpdateQuestionAsync(questionId, dto);
            return Ok(question);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{questionId}")]
    public async Task<IActionResult> Delete(Guid questionId)
    {
        try
        {
            await _service.DeleteQuestionAsync(questionId);
            return Ok(new { message = "Question deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{questionId}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(Guid questionId)
    {
        try
        {
            var question = await _service.ToggleQuestionStatusAsync(questionId);
            return Ok(question);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
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
