import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../../api/course.service';
import { Course, CourseStatus, Difficulty } from '../../../api/models/course.models';
import { SharedNavbarComponent } from '../../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedNavbarComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  
  courses = signal<Course[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  readonly CourseStatus = CourseStatus;

  ngOnInit() {
    this.loadMyCourses();
  }

  async loadMyCourses() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const courses = await this.courseService.getMyCourses().toPromise();
      this.courses.set(courses || []);
    } catch (error) {
      this.error.set('Failed to load courses');
      console.error('Error loading courses:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async publishCourse(courseId: string) {
    try {
      await this.courseService.publishCourse(courseId).toPromise();
      // Reload courses to reflect the status change
      this.loadMyCourses();
    } catch (error) {
      console.error('Error publishing course:', error);
    }
  }

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0: return 'Beginner';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      default: return 'Unknown';
    }
  }

  getStatusLabel(status: number): string {
    return status === CourseStatus.Published ? 'Published' : 'Draft';
  }

  getPublishedCount(): number {
    return this.courses().filter(c => c.courseStatus === CourseStatus.Published).length;
  }

  getDraftCount(): number {
    return this.courses().filter(c => c.courseStatus === CourseStatus.Draft).length;
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}