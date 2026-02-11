using EduCore.Application.Interfaces;
using EduCore.Infrastructure.Data;
using EduCore.Application.DTOs.Question;
using EduCore.Domain.Entities;
using EduCore.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EduCore.Application.Services;

public class QuestionService : IQuestionServices
{
    private readonly AppDbContext _context;

    public QuestionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateQuestionAsync(CreateQuestionDto dto)
    {
        ValidateQuestion(dto);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            Text = dto.Text,
            Type = dto.Type,
            QuizId = dto.QuizId,
            IsActive = true,
            Options = dto.Options.Select(o => new QuestionOption
            {
                Id = Guid.NewGuid(),
                Text = o.Text,
                IsCorrect = o.IsCorrect
            }).ToList()
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return question.Id;
    }

    private void ValidateQuestion(CreateQuestionDto dto)
    {
        if (dto.Options == null || !dto.Options.Any())
            throw new ArgumentException("Options are required.");

        var correctCount = dto.Options.Count(o => o.IsCorrect);

        if (dto.Type == QuestionType.SingleChoice && correctCount != 1)
            throw new ArgumentException("Single choice must have exactly one correct answer.");

        if (dto.Type == QuestionType.MultipleChoice && correctCount < 1)
            throw new ArgumentException("Multiple choice must have at least one correct answer.");
    }
}