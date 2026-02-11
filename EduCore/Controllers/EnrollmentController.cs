using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EduCore.Application.Interfaces;
using System.Security.Claims;

namespace EduCore.Controllers;
[Route("api/[controller]")]
[ApiController]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentServices _enrollmentService;

    public EnrollmentController(IEnrollmentServices enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpPost("{courseId}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> Enroll(Guid courseId)
    {
        
        var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        Console.WriteLine($"User ID: {userId}");
        Console.WriteLine($"User Role: {userRole}");

        if (userId == null)
            return Unauthorized("User ID not found in token");

        var result = await _enrollmentService
            .EnrollAsync(courseId, Guid.Parse(userId));

        if (result != "Enrollment successful.")
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyCourses()
    {
        var userId = User.FindFirst("id")?.Value;

        if (userId == null)
            return Unauthorized();

        var courses = await _enrollmentService
            .GetEnrolledCoursesAsync(Guid.Parse(userId));

        return Ok(courses);
    }
}