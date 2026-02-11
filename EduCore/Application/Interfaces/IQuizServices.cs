using EduCore.Application.DTOs.Quiz;
using EduCore.Domain.Entities;  

namespace EduCore.Application.Interfaces;

public interface IQuizServices
{
    Task<Guid> CreateQuizAsync(CreateQuizDto dto);
    Task<IEnumerable<Quiz>> GetByCourseAsync(Guid courseId);
    Task<Quiz> UpdateQuizAsync(Guid quizId, CreateQuizDto dto);
    Task<bool> DeleteQuizAsync(Guid quizId);
    
    Task<QuizForStudentDto> GetQuizForStudentAsync(Guid quizId, Guid studentId);
    Task<QuizResultDto> SubmitQuizAsync(SubmitQuizDto dto, Guid studentId);

}