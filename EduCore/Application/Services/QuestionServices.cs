using EduCore.Application.Interfaces;
using EduCore.Infrastructure.Data;
using EduCore.Application.DTOs.Question;
using EduCore.Domain.Entities;
using EduCore.Domain.Enums;
using OfficeOpenXml;

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
    
    
    
    public async Task<BulkUploadResultDto> UploadQuestionsAsync(
    IFormFile file,
    Guid quizId)
{
    var result = new BulkUploadResultDto();

    using var stream = new MemoryStream();
    await file.CopyToAsync(stream);

    using var package = new ExcelPackage(stream);
    var worksheet = package.Workbook.Worksheets[0];

    int rowCount = worksheet.Dimension.Rows;
    result.TotalRows = rowCount - 1; // header row

    for (int row = 2; row <= rowCount; row++)
    {
        try
        {
            var questionText = worksheet.Cells[row, 1].Text?.Trim();
            var typeText = worksheet.Cells[row, 2].Text?.Trim();

            if (string.IsNullOrEmpty(questionText))
                throw new Exception("Question text is empty");

            if (!Enum.TryParse<QuestionType>(typeText, true, out var type))
                throw new Exception("Invalid question type");

            var options = new List<QuestionOption>();
            for (int i = 0; i < 4; i++)
            {
                var optionText = worksheet.Cells[row, 3 + i].Text?.Trim();
                if (!string.IsNullOrEmpty(optionText))
                {
                    options.Add(new QuestionOption
                    {
                        Text = optionText
                    });
                }
            }

            if (options.Count < 2)
                throw new Exception("Minimum 2 options required");

            var correctRaw = worksheet.Cells[row, 7].Text?.Trim();
            if (string.IsNullOrEmpty(correctRaw))
                throw new Exception("Correct option missing");

            var correctIndexes = correctRaw
                .Split(',')
                .Select(x => int.Parse(x.Trim()) - 1)
                .ToList();

            foreach (var index in correctIndexes)
            {
                if (index < 0 || index >= options.Count)
                    throw new Exception("Correct option index invalid");

                options[index].IsCorrect = true;
            }

            if (!options.Any(o => o.IsCorrect))
                throw new Exception("At least one correct answer required");

            var question = new Question
            {
                QuizId = quizId,
                Text = questionText,
                Type = type,
                Options = options,
                IsActive = true
            };

            _context.Questions.Add(question);
            result.ValidQuestions++;
        }
        catch (Exception ex)
        {
            result.InvalidQuestions++;
            result.Errors.Add($"Row {row}: {ex.Message}");
        }
    }

    await _context.SaveChangesAsync();

    return result;
}
}