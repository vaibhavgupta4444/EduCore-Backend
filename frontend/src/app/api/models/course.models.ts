export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  courseStatus: CourseStatus;
  thumbnail: string;
  instructorId: string;
  instructor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export enum Difficulty {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2
}

export enum CourseStatus {
  Draft = 0,
  Published = 1
}

export enum Role {
  User = 0,
  Instructor = 1,
  Admin = 2
}

export interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  course?: Course;
}

export interface CourseFilters {
  category?: string;
  search?: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedDuration: number;
  thumbnailUrl?: string;
  courseStatus: CourseStatus;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  isActive: boolean;
  quizId: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export enum QuestionType {
  MultipleChoice = 0,
  TrueFalse = 1,
  ShortAnswer = 2
}