import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EnrollmentService } from '../../api/enrollment.service';
import { QuizService } from '../../api/quiz.service';
import { Course, Difficulty } from '../../api/models/course.models';
import { Quiz } from '../../api/models/quiz.models';
import { SharedNavbarComponent } from '../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, RouterLink, SharedNavbarComponent],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  enrolledCourses = signal<Course[]>([]);
  courseQuizzes = signal<Map<string, Quiz[]>>(new Map());
  loading = signal(false);
  loadingQuizzes = signal<Set<string>>(new Set());
  selectedCourse = signal<Course | null>(null);
  showCourseDetails = signal(false);

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.loading.set(true);
    
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (courses) => {
        this.enrolledCourses.set(courses);
        this.loading.set(false);
        // Load quizzes for each course
        courses.forEach(course => this.loadQuizzesForCourse(course.id));
      },
      error: (error) => {
        console.error('Error loading enrolled courses:', error);
        this.loading.set(false);
      }
    });
  }

  loadQuizzesForCourse(courseId: string): void {
    const loading = new Set(this.loadingQuizzes());
    loading.add(courseId);
    this.loadingQuizzes.set(loading);

    this.quizService.getQuizzesByCourse(courseId).subscribe({
      next: (quizzes) => {
        const quizMap = new Map(this.courseQuizzes());
        quizMap.set(courseId, quizzes);
        this.courseQuizzes.set(quizMap);
        
        const loadingSet = new Set(this.loadingQuizzes());
        loadingSet.delete(courseId);
        this.loadingQuizzes.set(loadingSet);
      },
      error: (error) => {
        console.error('Error loading quizzes for course:', error);
        const loadingSet = new Set(this.loadingQuizzes());
        loadingSet.delete(courseId);
        this.loadingQuizzes.set(loadingSet);
      }
    });
  }

  getQuizzesForCourse(courseId: string): Quiz[] {
    return this.courseQuizzes().get(courseId) || [];
  }

  isLoadingQuizzes(courseId: string): boolean {
    return this.loadingQuizzes().has(courseId);
  }

  getDifficultyLabel(difficulty: Difficulty): string {
    switch (difficulty) {
      case Difficulty.Beginner: return 'Beginner';
      case Difficulty.Intermediate: return 'Intermediate';
      case Difficulty.Advanced: return 'Advanced';
      default: return 'Unknown';
    }
  }

  getDifficultyColor(difficulty: Difficulty): string {
    switch (difficulty) {
      case Difficulty.Beginner: return 'bg-green-100 text-green-800';
      case Difficulty.Intermediate: return 'bg-yellow-100 text-yellow-800';
      case Difficulty.Advanced: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  viewCourseDetails(course: Course): void {
    this.selectedCourse.set(course);
    this.showCourseDetails.set(true);
  }

  closeCourseDetails(): void {
    this.showCourseDetails.set(false);
    this.selectedCourse.set(null);
  }

  startQuiz(quizId: string): void {
    this.router.navigate(['/quiz', quizId]);
  }
}