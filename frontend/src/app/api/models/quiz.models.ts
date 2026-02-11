export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  timeLimitMinutes: number;
  createdAt: string;
  updatedAt: string;
  questions?: any[];
}

export interface CreateQuizDto {
  title: string;
  courseId: string;
  timeLimitMinutes: number;
}

// Student-facing quiz DTOs
export interface QuizForStudent {
  quizId: string;
  title: string;
  timeLimitMinutes: number;
  questions: QuestionForStudent[];
}

export interface QuestionForStudent {
  questionId: string;
  text: string;
  type: QuestionType;
  options: OptionForStudent[];
}

export interface OptionForStudent {
  optionId: string;
  text: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionId: string;
  textAnswer?: string;
}

export interface SubmitQuizDto {
  quizId: string;
  answers: StudentAnswer[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
}

export enum QuestionType {
  SingleChoice = 0,
  MultipleChoice = 1
}
