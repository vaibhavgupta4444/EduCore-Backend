import { Component, inject, signal, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizService } from '../../api/quiz.service';
import { QuizForStudent, QuestionForStudent, StudentAnswer, SubmitQuizDto, QuizResult, QuestionType } from '../../api/models/quiz.models';
import { SharedNavbarComponent } from '../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    SharedNavbarComponent,
    MatStepperModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);

  @ViewChild('stepper') stepper!: MatStepper;

  quiz = signal<QuizForStudent | null>(null);
  answers = signal<Map<string, string>>(new Map());
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Timer
  timeRemaining = signal(0); // in seconds
  timerInterval: any = null;
  
  // Quiz completion
  quizCompleted = signal(false);
  quizResult = signal<QuizResult | null>(null);
  submitting = signal(false);

  readonly QuestionType = QuestionType;

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('quizId');
    if (quizId) {
      this.loadQuiz(quizId);
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadQuiz(quizId: string) {
    this.loading.set(true);
    this.error.set(null);
    
    this.quizService.startQuiz(quizId).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
        this.timeRemaining.set(quiz.timeLimitMinutes * 60);
        this.startTimer();
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.error?.message || 'Failed to load quiz');
        this.loading.set(false);
      }
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const currentTime = this.timeRemaining();
      if (currentTime > 0) {
        this.timeRemaining.set(currentTime - 1);
      } else {
        this.stopTimer();
        this.autoSubmitQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getFormattedTime(): string {
    const seconds = this.timeRemaining();
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  isTimeLow(): boolean {
    return this.timeRemaining() < 300; // Less than 5 minutes
  }

  selectAnswer(question: QuestionForStudent, optionId: string) {
    const updatedAnswers = new Map(this.answers());
    updatedAnswers.set(question.questionId, optionId);
    this.answers.set(updatedAnswers);
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    return this.answers().get(questionId) === optionId;
  }

  isQuestionAnswered(questionId: string): boolean {
    return this.answers().has(questionId);
  }

  canSubmit(): boolean {
    const quiz = this.quiz();
    if (!quiz) return false;
    // Allow submission even if not all questions are answered
    return true;
  }

  submitQuiz() {
    if (!this.canSubmit() || this.submitting()) return;

    const quiz = this.quiz();
    if (!quiz) return;

    if (!confirm('Are you sure you want to submit the quiz? This action cannot be undone.')) {
      return;
    }

    this.stopTimer();
    this.submitting.set(true);
    this.error.set(null);

    const studentAnswers: StudentAnswer[] = [];
    this.answers().forEach((optionId, questionId) => {
      studentAnswers.push({
        questionId,
        selectedOptionId: optionId
      });
    });

    // Transform to PascalCase for backend
    const submission: any = {
      QuizId: quiz.quizId,
      Answers: studentAnswers.map(answer => ({
        QuestionId: answer.questionId,
        SelectedOptionId: answer.selectedOptionId,
        TextAnswer: answer.textAnswer || ''
      }))
    };

    this.quizService.submitQuiz(submission).subscribe({
      next: (result) => {
        this.quizResult.set(result);
        this.quizCompleted.set(true);
        this.submitting.set(false);
      },
      error: (error) => {
        this.error.set(error.error?.message || 'Failed to submit quiz');
        this.submitting.set(false);
        this.startTimer(); // Restart timer on error
      }
    });
  }

  autoSubmitQuiz() {
    if (this.quizCompleted()) return;
    alert('Time is up! Your quiz will be submitted automatically.');
    this.submitQuiz();
  }

  getProgressPercentage(): number {
    const quiz = this.quiz();
    if (!quiz || quiz.questions.length === 0) return 0;
    return (this.answers().size / quiz.questions.length) * 100;
  }

  exitQuiz() {
    if (!this.quizCompleted()) {
      if (!confirm('Are you sure you want to exit? Your progress will be lost.')) {
        return;
      }
    }
    this.router.navigate(['/my-courses']);
  }
}
