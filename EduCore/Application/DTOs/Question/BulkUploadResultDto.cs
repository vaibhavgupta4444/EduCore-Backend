namespace EduCore.Application.DTOs.Question;

public class BulkUploadResultDto
{
    public int TotalRows { get; set; }
    public int ValidQuestions { get; set; }
    public int InvalidQuestions { get; set; }
    public List<string> Errors { get; set; } = new();
}