import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { Quiz, CreateQuizDto, QuizForStudent, SubmitQuizDto, QuizResult } from './models/quiz.models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly apiClient = inject(ApiClient);

  createQuiz(quizDto: CreateQuizDto): Observable<string> {
    return this.apiClient.post<string, CreateQuizDto>('/api/Quiz', quizDto);
  }

  getQuizzesByCourse(courseId: string): Observable<Quiz[]> {
    return this.apiClient.get<Quiz[]>(`/api/Quiz/course/${courseId}`);
  }

  getQuizById(quizId: string): Observable<Quiz> {
    return this.apiClient.get<Quiz>(`/api/Quiz/${quizId}`);
  }

  updateQuiz(id: string, quizDto: CreateQuizDto): Observable<void> {
    return this.apiClient.put<void, CreateQuizDto>(`/api/Quiz/${id}`, quizDto);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.apiClient.delete(`/api/Quiz/${id}`);
  }

  // Student methods
  startQuiz(quizId: string): Observable<QuizForStudent> {
    return this.apiClient.get<QuizForStudent>(`/api/Quiz/${quizId}/start`);
  }

  submitQuiz(submission: SubmitQuizDto): Observable<QuizResult> {
    return this.apiClient.post<QuizResult, SubmitQuizDto>('/api/Quiz/submit', submission);
  }
}
