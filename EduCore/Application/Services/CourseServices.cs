using EduCore.Domain.Entities;
using EduCore.Domain.Enums;
using EduCore.Infrastructure.Data;
using EduCore.Application.DTOs.Course;
using EduCore.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EduCore.Application.Services;
public class CourseService : ICourseServices
{
    private readonly AppDbContext _context;

    public CourseService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> CreateCourseAsync(CreateCourseDto dto, Guid instructorId)
    {
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Difficulty = dto.Difficulty,
            EstimatedDuration = dto.EstimatedDuration,
            Thumbnail = dto.ThumbnailUrl,
            InstructorId = instructorId,
            CourseStatus = CourseStatus.Draft,
            CreatedBy = instructorId
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return "Course created successfully";
    }

    public async Task<List<Course>> GetPublishedCoursesAsync(string? category, string? search)
    {
        var query = _context.Courses
            .Where(c => c.CourseStatus == CourseStatus.Published)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(c => c.Category == category);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(c => c.Title.Contains(search));

        return await query.ToListAsync();
    }

    public async Task<List<Course>> GetInstructorCoursesAsync(Guid instructorId)
    {
        return await _context.Courses
            .Where(c => c.InstructorId == instructorId)
            .ToListAsync();
    }

    public async Task<string> PublishCourseAsync(Guid courseId, Guid instructorId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructorId);

        if (course == null)
            throw new KeyNotFoundException("Course not found");

        course.CourseStatus = CourseStatus.Published;

        await _context.SaveChangesAsync();

        return "Course published successfully";
    }

    public async Task<string> UpdateCourseAsync(Guid courseId, UpdateCourseDto dto, Guid instructorId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructorId);

        if (course == null)
            throw new KeyNotFoundException("Course not found");

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.Category = dto.Category;
        course.Difficulty = dto.Difficulty;
        course.EstimatedDuration = dto.EstimatedDuration;
        course.Thumbnail = dto.ThumbnailUrl;
        course.UpdatedAt = DateTime.UtcNow;
        course.UpdatedBy = instructorId;

        await _context.SaveChangesAsync();

        return "Course updated successfully";
    }
}
