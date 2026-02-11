import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { Course, CourseFilters, CreateCourseDto } from './models/course.models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiClient = inject(ApiClient);

  getPublishedCourses(filters?: CourseFilters): Observable<Course[]> {
    const params: Record<string, string> = {};
    
    if (filters?.category) {
      params['category'] = filters.category;
    }
    
    if (filters?.search) {
      params['search'] = filters.search;
    }

    return this.apiClient.get<Course[]>('/api/Course/published', { params });
  }

  getCourseById(id: string): Observable<Course> {
    return this.apiClient.get<Course>(`/api/Course/${id}`);
  }

  // Instructor-specific methods
  createCourse(courseData: CreateCourseDto): Observable<{ success: boolean; message: string }> {
    return this.apiClient.post<{ success: boolean; message: string }>('/api/Course', courseData);
  }

  getMyCourses(): Observable<Course[]> {
    return this.apiClient.get<Course[]>('/api/Course/my-courses');
  }

  publishCourse(courseId: string): Observable<{ success: boolean; message: string }> {
    return this.apiClient.put<{ success: boolean; message: string }>(`/api/Course/${courseId}/publish`, {});
  }

  // Question/Quiz upload functionality
  uploadQuestionBank(courseId: string, file: File): Observable<{ success: boolean; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiClient.post<{ success: boolean; message: string }>(
      `/api/Question/upload/${courseId}`,
      formData
    );
  }
}