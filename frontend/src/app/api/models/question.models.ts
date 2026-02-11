export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  isActive: boolean;
  quizId: string;
  options: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  quizId: string;
  options: CreateOptionDto[];
}

export interface CreateOptionDto {
  text: string;
  isCorrect: boolean;
}

export interface BulkUploadResult {
  totalRows: number;
  validQuestions: number;
  invalidQuestions: number;
  errors: string[];
}

export enum QuestionType {
  SingleChoice = 0,
  MultipleChoice = 1
}
