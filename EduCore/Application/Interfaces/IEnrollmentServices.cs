using EduCore.Domain.Entities;

namespace EduCore.Application.Interfaces;

public interface IEnrollmentServices
{
    Task<string> EnrollAsync(Guid courseId, Guid studentId);
    Task<List<Course>> GetEnrolledCoursesAsync(Guid studentId);
}