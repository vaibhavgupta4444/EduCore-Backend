using EduCore.Application.DTOs.Question;
using EduCore.Domain.Entities;

namespace EduCore.Application.Interfaces;

public interface IQuestionServices
{
    Task<Guid> CreateQuestionAsync(CreateQuestionDto dto);
    Task<BulkUploadResultDto> UploadQuestionsAsync(IFormFile file, Guid quizId);
    Task<IEnumerable<Question>> GetByQuizAsync(Guid quizId);
    Task<Question> UpdateQuestionAsync(Guid questionId, CreateQuestionDto dto);
    Task<bool> DeleteQuestionAsync(Guid questionId);
    Task<Question> ToggleQuestionStatusAsync(Guid questionId);
}