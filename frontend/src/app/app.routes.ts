import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CourseCatalogComponent } from './pages/course-catalog/course-catalog.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { TakeQuizComponent } from './pages/take-quiz/take-quiz.component';
import { CreateCourseComponent } from './pages/instructor/create-course/create-course.component';
import { ManageCoursesComponent } from './pages/instructor/manage-courses/manage-courses.component';
import { QuestionBankComponent } from './pages/instructor/question-bank/question-bank.component';
import { InstructorDashboardComponent } from './pages/instructor/dashboard/instructor-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { InstructorGuard } from './guards/instructor.guard';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'signin', component: SignInPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  { path: 'courses', component: CourseCatalogComponent, canActivate: [AuthGuard] },
  { path: 'my-courses', component: MyCoursesComponent, canActivate: [AuthGuard] },
  { path: 'quiz/:quizId', component: TakeQuizComponent, canActivate: [UserGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'instructor/dashboard', component: InstructorDashboardComponent, canActivate: [InstructorGuard] },
  { path: 'instructor/create-course', component: CreateCourseComponent, canActivate: [InstructorGuard] },
  { path: 'instructor/manage-course/:id', component: ManageCoursesComponent, canActivate: [InstructorGuard] },
  { path: 'instructor/question-bank/:quizId', component: QuestionBankComponent, canActivate: [InstructorGuard] }
];
