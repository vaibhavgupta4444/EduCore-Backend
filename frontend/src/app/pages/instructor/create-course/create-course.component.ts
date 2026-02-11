import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { CourseService } from '../../../api/course.service';
import { CourseStatus, Difficulty, CreateCourseDto } from '../../../api/models/course.models';
import { SharedNavbarComponent } from '../../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedNavbarComponent],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent {
  private readonly fb = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  readonly Difficulty = Difficulty;
  readonly CourseStatus = CourseStatus;
  
  readonly categories = [
    'Programming',
    'Web Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Language Learning',
    'Health & Fitness'
  ];

  courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    difficulty: [Difficulty.Beginner, Validators.required],
    estimatedDuration: [1, [Validators.required, Validators.min(1), Validators.max(500)]],
    thumbnailUrl: [''],
    courseStatus: [CourseStatus.Draft, Validators.required]
  });

  async onSubmit() {
    if (this.courseForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      
      try {
        const formValue = this.courseForm.value;
        
        // Transform camelCase to PascalCase for backend
        const courseDto = {
          Title: formValue.title,
          Description: formValue.description,
          Category: formValue.category,
          Difficulty: Number(formValue.difficulty),
          EstimatedDuration: Number(formValue.estimatedDuration),
          ThumbnailUrl: formValue.thumbnailUrl || '',
          CourseStatus: Number(formValue.courseStatus)
        };
        
        const result = await this.courseService.createCourse(courseDto as any).toPromise();
        
        if (result?.success) {
          this.success.set(true);
          setTimeout(() => {
            this.router.navigate(['/courses']);
          }, 2000);
        }
      } catch (error: any) {
        this.error.set(error.error?.message || error.message || 'Failed to create course');
      } finally {
        this.loading.set(false);
      }
    } else {
      this.courseForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/courses']);
  }

  getDifficultyLabel(difficulty: Difficulty): string {
    switch (difficulty) {
      case Difficulty.Beginner: return 'Beginner';
      case Difficulty.Intermediate: return 'Intermediate';
      case Difficulty.Advanced: return 'Advanced';
      default: return 'Unknown';
    }
  }

  getStatusLabel(status: CourseStatus): string {
    return status === CourseStatus.Published ? 'Published' : 'Draft';
  }
}