import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { CreateQuestionDto, BulkUploadResult, Question } from './models/question.models';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly apiClient = inject(ApiClient);

  createQuestion(questionDto: CreateQuestionDto): Observable<string> {
    return this.apiClient.post<string, CreateQuestionDto>('/api/Question', questionDto);
  }

  bulkUploadQuestions(quizId: string, file: File): Observable<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.apiClient.postFile<BulkUploadResult>(`/api/Question/bulk-upload/${quizId}`, formData);
  }

  getQuestionsByQuiz(quizId: string): Observable<Question[]> {
    return this.apiClient.get<Question[]>(`/api/Question/quiz/${quizId}`);
  }

  updateQuestion(id: string, questionDto: CreateQuestionDto): Observable<void> {
    return this.apiClient.put<void, CreateQuestionDto>(`/api/Question/${id}`, questionDto);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.apiClient.delete(`/api/Question/${id}`);
  }

  toggleQuestionStatus(id: string): Observable<void> {
    return this.apiClient.put<void, null>(`/api/Question/${id}/toggle-status`, null);
  }
}
