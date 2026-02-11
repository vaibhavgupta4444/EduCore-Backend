using EduCore.Application.DTOs.Question;

namespace EduCore.Application.Interfaces;

public interface IQuestionServices
{
    Task<Guid> CreateQuestionAsync(CreateQuestionDto dto);
}