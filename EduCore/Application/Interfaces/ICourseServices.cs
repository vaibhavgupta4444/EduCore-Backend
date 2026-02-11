using EduCore.Domain.Entities;
using EduCore.Application.DTOs.Course;

namespace EduCore.Application.Interfaces;

public interface ICourseServices
{
    Task<string> CreateCourseAsync(CreateCourseDto dto, Guid instructorId);
    Task<string> UpdateCourseAsync(Guid courseId, UpdateCourseDto dto, Guid instructorId);
    Task<string> PublishCourseAsync(Guid courseId, Guid instructorId);
    Task<List<Course>> GetPublishedCoursesAsync(string? category, string? search);
    Task<List<Course>> GetInstructorCoursesAsync(Guid instructorId);
}