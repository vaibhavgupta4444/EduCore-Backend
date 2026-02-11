using EduCore.Application.DTOs.Question;

namespace EduCore.Application.Interfaces;

public interface IQuestionServices
{
    Task<Guid> CreateQuestionAsync(CreateQuestionDto dto);
    Task<BulkUploadResultDto> UploadQuestionsAsync(IFormFile file, Guid quizId);
}