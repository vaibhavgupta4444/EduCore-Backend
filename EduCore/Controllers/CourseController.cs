using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EduCore.Application.Interfaces;
using EduCore.Application.DTOs.Course;

namespace EduCore.Controllers;
[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly ICourseServices _courseService;

    public CourseController(ICourseServices courseService)
    {
        _courseService = courseService;
    }

    [Authorize(Roles = "Instructor")]
    [HttpPost]
    public async Task<IActionResult> CreateCourse(CreateCourseDto dto)
    {
        var instructorId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var result = await _courseService.CreateCourseAsync(dto, instructorId);

        return Ok(new { success = true, message = result });
    }
    
    [Authorize(Roles = "Instructor")]
    [HttpGet("my-courses")]
    public async Task<IActionResult> GetMyCourses()
    {
        var instructorId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var courses = await _courseService.GetInstructorCoursesAsync(instructorId);

        return Ok(courses);
    }

    [HttpGet("published")]
    public async Task<IActionResult> GetPublishedCourses(
        [FromQuery] string? category,
        [FromQuery] string? search)
    {
        var courses = await _courseService
            .GetPublishedCoursesAsync(category, search);

        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseById(Guid id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);
        
        if (course == null)
            return NotFound(new { message = "Course not found" });

        return Ok(course);
    }

    [Authorize(Roles = "Instructor")]
    [HttpPut("{id}/publish")]
    public async Task<IActionResult> PublishCourse(Guid id)
    {
        var instructorId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var result = await _courseService.PublishCourseAsync(id, instructorId);

        return Ok(new { success = true, message = result });
    }
}