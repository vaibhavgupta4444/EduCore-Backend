import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../api/course.service';
import { QuizService } from '../../../api/quiz.service';
import { Course, CourseStatus } from '../../../api/models/course.models';
import { Quiz, CreateQuizDto } from '../../../api/models/quiz.models';
import { SharedNavbarComponent } from '../../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SharedNavbarComponent],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly quizService = inject(QuizService);

  course = signal<Course | null>(null);
  quizzes = signal<Quiz[]>([]);
  loading = signal(false);
  quizzesLoading = signal(false);
  error = signal<string | null>(null);
  
  showQuizForm = signal(false);
  editingQuiz = signal<Quiz | null>(null);

  courseId = signal<string | null>(null);

  readonly CourseStatus = CourseStatus;
  
  quizForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    timeLimitMinutes: [60, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId.set(params['id']);
        this.loadCourse(params['id']);
        this.loadQuizzes(params['id']);
      }
    });
  }

  async loadCourse(id: string) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const course = await this.courseService.getCourseById(id).toPromise();
      this.course.set(course || null);
    } catch (error) {
      this.error.set('Failed to load course');
      console.error('Error loading course:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getStatusLabel(status: number): string {
    return status === CourseStatus.Published ? 'Published' : 'Draft';
  }

  goBack() {
    this.router.navigate(['/instructor/dashboard']);
  }
  
  loadQuizzes(courseId: string) {
    this.quizzesLoading.set(true);
    this.quizService.getQuizzesByCourse(courseId).subscribe({
      next: (quizzes) => {
        this.quizzes.set(quizzes);
        this.quizzesLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        this.quizzesLoading.set(false);
      }
    });
  }
  
  toggleQuizForm() {
    this.showQuizForm.set(!this.showQuizForm());
    if (!this.showQuizForm()) {
      this.resetQuizForm();
    }
  }
  
  resetQuizForm() {
    this.quizForm.reset({ timeLimitMinutes: 60 });
    this.editingQuiz.set(null);
  }
  
  editQuiz(quiz: Quiz) {
    this.editingQuiz.set(quiz);
    this.showQuizForm.set(true);
    this.quizForm.patchValue({
      title: quiz.title,
      timeLimitMinutes: quiz.timeLimitMinutes
    });
  }
  
  onQuizSubmit() {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const formValue = this.quizForm.value;
    const quizDto: CreateQuizDto = {
      title: formValue.title,
      courseId: this.courseId()!,
      timeLimitMinutes: formValue.timeLimitMinutes
    };

    this.loading.set(true);
    this.error.set(null);

    if (this.editingQuiz()) {
      this.quizService.updateQuiz(this.editingQuiz()!.id, quizDto).subscribe({
        next: () => {
          this.loading.set(false);
          this.showQuizForm.set(false);
          this.resetQuizForm();
          this.loadQuizzes(this.courseId()!);
        },
        error: (error: any) => {
          this.error.set(error.error?.message || 'Failed to update quiz');
          this.loading.set(false);
        }
      });
    } else {
      this.quizService.createQuiz(quizDto).subscribe({
        next: () => {
          this.loading.set(false);
          this.showQuizForm.set(false);
          this.resetQuizForm();
          this.loadQuizzes(this.courseId()!);
        },
        error: (error: any) => {
          this.error.set(error.error?.message || 'Failed to create quiz');
          this.loading.set(false);
        }
      });
    }
  }
  
  deleteQuiz(quiz: Quiz) {
    if (!confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      return;
    }

    this.quizService.deleteQuiz(quiz.id).subscribe({
      next: () => {
        this.loadQuizzes(this.courseId()!);
      },
      error: (error) => {
        this.error.set('Failed to delete quiz');
        console.error(error);
      }
    });
  }
}