import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client.service';
import { Course } from './models/course.models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly apiClient = inject(ApiClient);

  enrollInCourse(courseId: string): Observable<string> {
    return this.apiClient.post<string>(`/api/Enrollment/${courseId}`, {});
  }

  getMyEnrollments(): Observable<Course[]> {
    return this.apiClient.get<Course[]>('/api/Enrollment/my');
  }
}