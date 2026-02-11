using EduCore.Domain.Entities;
using EduCore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using EduCore.Application.Interfaces;
using EduCore.Domain.Enums;

public class EnrollmentService : IEnrollmentServices
{
    private readonly AppDbContext _context;

    public EnrollmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> EnrollAsync(Guid courseId, Guid studentId)
    {
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId && c.CourseStatus == CourseStatus.Published);

        if (course == null)
            return "Course not found or not published.";

        var alreadyEnrolled = await _context.Enrollments
            .AnyAsync(e => e.CourseId == courseId && e.StudentId == studentId);

        if (alreadyEnrolled)
            return "Already enrolled.";

        var enrollment = new Enrollment
        {
            CourseId = courseId,
            StudentId = studentId
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return "Enrollment successful.";
    }

    public async Task<List<Course>> GetEnrolledCoursesAsync(Guid studentId)
    {
        return await _context.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.Course)
            .ToListAsync();
    }
}