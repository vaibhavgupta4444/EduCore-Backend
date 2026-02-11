using EduCore.Domain.Entities;
using EduCore.Application.DTOs.Quiz;
using EduCore.Application.Interfaces;
using EduCore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using EduCore.Application.DTOs.Question;
using EduCore.Domain.Enums;

namespace EduCore.Application.Services;
public class QuizService : IQuizServices
{
    private readonly AppDbContext _context;

    public QuizService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateQuizAsync(CreateQuizDto dto)
    {
        var quiz = new Quiz
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            CourseId = dto.CourseId,
            TimeLimitMinutes = dto.TimeLimitMinutes
        };

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        return quiz.Id;
    }

    public async Task<IEnumerable<Quiz>> GetByCourseAsync(Guid courseId)
    {
        return await _context.Quizzes
            .Where(q => q.CourseId == courseId)
            .ToListAsync();
    }
    
    public async Task<QuizForStudentDto> GetQuizForStudentAsync(Guid quizId, Guid studentId)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == quizId);

        if (quiz == null)
            throw new KeyNotFoundException("Quiz not found.");

        var isEnrolled = await _context.Enrollments
            .AnyAsync(e => e.CourseId == quiz.CourseId && e.StudentId == studentId);

        if (!isEnrolled)
            throw new UnauthorizedAccessException("You are not enrolled in this course.");

        return new QuizForStudentDto
        {
            QuizId = quiz.Id,
            Title = quiz.Title,
            TimeLimitMinutes = quiz.TimeLimitMinutes,
            Questions = quiz.Questions
                .Where(q => q.IsActive)
                .Select(q => new QuestionForStudentDto
                {
                    QuestionId = q.Id,
                    Text = q.Text,
                    Type = q.Type,
                    Options = q.Options.Select(o => new OptionForStudentDto
                    {
                        OptionId = o.Id,
                        Text = o.Text
                    }).ToList()
                }).ToList()
        };
    }
    
    
    public async Task<QuizResultDto> SubmitQuizAsync(SubmitQuizDto dto, Guid studentId)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions.Where(q => q.IsActive))
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

        if (quiz == null)
            throw new KeyNotFoundException("Quiz not found.");

        var isEnrolled = await _context.Enrollments
            .AnyAsync(e => e.CourseId == quiz.CourseId && e.StudentId == studentId);

        if (!isEnrolled)
            throw new UnauthorizedAccessException("You are not enrolled in this course.");

        int score = 0;
        var activeQuestions = quiz.Questions;

        foreach (var question in activeQuestions)
        {
            var studentAnswer = dto.Answers
                .FirstOrDefault(a => a.QuestionId == question.Id);

            if (studentAnswer == null || studentAnswer.SelectedOptionId == null)
                continue;

            
            var correctOptionId = question.Options
                .Where(o => o.IsCorrect)
                .Select(o => o.Id)
                .FirstOrDefault();

            if (correctOptionId != Guid.Empty &&
                studentAnswer.SelectedOptionId == correctOptionId)
            {
                score++;
            }
        }

        var totalQuestions = activeQuestions.Count;

        var attempt = new QuizAttempt
        {
            QuizId = quiz.Id,
            StudentId = studentId,
            Score = score,
            TotalQuestions = totalQuestions,
        };

        _context.QuizAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        return new QuizResultDto
        {
            Score = score,
            TotalQuestions = totalQuestions,
            Passed = totalQuestions > 0 && score >= (totalQuestions * 0.5)
        };
    }

    public async Task<Quiz> UpdateQuizAsync(Guid quizId, CreateQuizDto dto)
    {
        var quiz = await _context.Quizzes.FindAsync(quizId);
        
        if (quiz == null)
            throw new KeyNotFoundException("Quiz not found.");

        quiz.Title = dto.Title;
        quiz.TimeLimitMinutes = dto.TimeLimitMinutes;

        _context.Quizzes.Update(quiz);
        await _context.SaveChangesAsync();

        return quiz;
    }

    public async Task<bool> DeleteQuizAsync(Guid quizId)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == quizId);
        
        if (quiz == null)
            throw new KeyNotFoundException("Quiz not found.");

        // Remove all question options
        foreach (var question in quiz.Questions)
        {
            _context.QuestionOptions.RemoveRange(question.Options);
        }

        // Remove all questions
        _context.Questions.RemoveRange(quiz.Questions);

        // Remove the quiz
        _context.Quizzes.Remove(quiz);
        
        await _context.SaveChangesAsync();

        return true;
    }


}