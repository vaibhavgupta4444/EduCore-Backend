import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../api/course.service';
import { EnrollmentService } from '../../api/enrollment.service';
import { AuthService } from '../../api/auth.service';
import { Course, CourseFilters, Difficulty } from '../../api/models/course.models';
import { SharedNavbarComponent } from '../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-course-catalog',
  imports: [CommonModule, FormsModule, SharedNavbarComponent],
  templateUrl: './course-catalog.component.html',
  styleUrl: './course-catalog.component.css'
})
export class CourseCatalogComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  courses = signal<Course[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  selectedCategory = signal('');
  enrollingCourseIds = signal<Set<string>>(new Set());
  errorMessage = signal('');
  
  // Available categories (you might want to add a backend endpoint for this)
  categories = [
    'Programming',
    'Data Science',
    'Web Development', 
    'Mobile Development',
    'DevOps',
    'UI/UX Design',
    'Business',
    'Marketing'
  ];

  // Computed filtered courses
  filteredCourses = computed(() => {
    let filtered = this.courses();
    
    // Filter by category
    if (this.selectedCategory()) {
      filtered = filtered.filter(course => 
        course.category.toLowerCase() === this.selectedCategory().toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.category.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    
    const filters: CourseFilters = {};
    if (this.selectedCategory()) filters.category = this.selectedCategory();
    if (this.searchTerm()) filters.search = this.searchTerm();

    this.courseService.getPublishedCourses(filters).subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading.set(false);
      }
    });
  }

  onCategoryChange(): void {
    this.loadCourses();
  }

  onSearchChange(): void {
    // Debounce search - you might want to implement proper debouncing
    setTimeout(() => {
      this.loadCourses();
    }, 300);
  }

  enrollInCourse(courseId: string): void {
    if (this.enrollingCourseIds().has(courseId)) return;

    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      alert('Please sign in to enroll in courses.');
      this.router.navigate(['/signin']);
      return;
    }

    // Debug: Log user role and token info
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();
    console.log('Attempting enrollment with token:', token ? 'Present' : 'Missing');
    console.log('User role:', role);

    this.errorMessage.set('');
    this.enrollingCourseIds.update(set => new Set([...set, courseId]));

    this.enrollmentService.enrollInCourse(courseId).subscribe({
      next: (response) => {
        console.log('Enrollment successful:', response);
        alert('Successfully enrolled in the course! Check your "My Courses" page.');
        this.enrollingCourseIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(courseId);
          return newSet;
        });
      },
      error: (error) => {
        console.error('Enrollment failed:', error);
        
        let errorMsg = 'Failed to enroll in the course. ';
        
        if (error.status === 401) {
          errorMsg += 'Please sign in again.';
          this.authService.logout();
          this.router.navigate(['/signin']);
        } else if (error.status === 403) {
          errorMsg += 'You do not have permission to enroll in courses.';
        } else if (error.status === 400) {
          errorMsg += error.error || 'You may already be enrolled in this course.';
        } else {
          errorMsg += 'Please try again later.';
        }
        
        this.errorMessage.set(errorMsg);
        alert(errorMsg);
        
        this.enrollingCourseIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(courseId);
          return newSet;
        });
      }
    });
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
}