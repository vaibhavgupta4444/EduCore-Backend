import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../api/question.service';
import { 
  Question, 
  QuestionType, 
  CreateQuestionDto, 
  BulkUploadResult 
} from '../../../api/models/question.models';
import { SharedNavbarComponent } from '../../../components/shared-navbar/shared-navbar.component';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedNavbarComponent],
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css']
})
export class QuestionBankComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly questionService = inject(QuestionService);

  quizId = signal<string>('');
  questions = signal<Question[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Form mode
  showForm = signal(false);
  editingQuestion = signal<Question | null>(null);
  
  // Bulk upload
  showUploadSection = signal(false);
  selectedFile = signal<File | null>(null);
  uploadLoading = signal(false);
  uploadResult = signal<BulkUploadResult | null>(null);
  
  readonly QuestionType = QuestionType;

  questionForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(5)]],
    type: [QuestionType.SingleChoice, Validators.required],
    options: this.fb.array([])
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['quizId']) {
        this.quizId.set(params['quizId']);
        this.loadQuestions();
      }
    });
    
    // Initialize with 4 empty options
    this.addOption();
    this.addOption();
    this.addOption();
    this.addOption();
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOption(text: string = '', isCorrect: boolean = false): FormGroup {
    return this.fb.group({
      text: [text, Validators.required],
      isCorrect: [isCorrect]
    });
  }

  addOption() {
    this.options.push(this.createOption());
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  loadQuestions() {
    this.loading.set(true);
    this.error.set(null);
    
    this.questionService.getQuestionsByQuiz(this.quizId()).subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load questions');
        console.error('Error loading questions:', error);
        this.loading.set(false);
      }
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.questionForm.reset({ type: QuestionType.SingleChoice });
    this.editingQuestion.set(null);
    this.options.clear();
    // Re-add 4 empty options
    this.addOption();
    this.addOption();
    this.addOption();
    this.addOption();
  }

  editQuestion(question: Question) {
    this.editingQuestion.set(question);
    this.showForm.set(true);
    
    this.questionForm.patchValue({
      text: question.text,
      type: question.type
    });
    
    this.options.clear();
    question.options.forEach(opt => {
      this.options.push(this.createOption(opt.text, opt.isCorrect));
    });
  }

  onSubmit() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const questionDto: CreateQuestionDto = {
      text: formValue.text,
      type: formValue.type,
      quizId: this.quizId(),
      options: formValue.options
    };

    // Validate options
    const correctAnswers = questionDto.options.filter(o => o.isCorrect).length;
    
    if (questionDto.type === QuestionType.SingleChoice && correctAnswers !== 1) {
      this.error.set('Single choice questions must have exactly one correct answer');
      return;
    }
    
    if (questionDto.type === QuestionType.MultipleChoice && correctAnswers < 1) {
      this.error.set('Multiple choice questions must have at least one correct answer');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.editingQuestion()) {
      this.questionService.updateQuestion(this.editingQuestion()!.id, questionDto).subscribe({
        next: () => {
          this.loading.set(false);
          this.showForm.set(false);
          this.resetForm();
          this.loadQuestions();
        },
        error: (error: any) => {
          this.error.set(error.error?.message || 'Failed to update question');
          this.loading.set(false);
        }
      });
    } else {
      this.questionService.createQuestion(questionDto).subscribe({
        next: () => {
          this.loading.set(false);
          this.showForm.set(false);
          this.resetForm();
          this.loadQuestions();
        },
        error: (error: any) => {
          this.error.set(error.error?.message || 'Failed to create question');
          this.loading.set(false);
        }
      });
    }
  }

  toggleQuestionStatus(question: Question) {
    this.questionService.toggleQuestionStatus(question.id).subscribe({
      next: () => {
        this.loadQuestions();
      },
      error: (error) => {
        this.error.set('Failed to toggle question status');
        console.error(error);
      }
    });
  }

  deleteQuestion(question: Question) {
    if (!confirm(`Are you sure you want to delete this question?`)) {
      return;
    }

    this.questionService.deleteQuestion(question.id).subscribe({
      next: () => {
        this.loadQuestions();
      },
      error: (error) => {
        this.error.set('Failed to delete question');
        console.error(error);
      }
    });
  }

  // Bulk upload methods
  toggleUploadSection() {
    this.showUploadSection.set(!this.showUploadSection());
    if (!this.showUploadSection()) {
      this.clearUpload();
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      
      if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
        this.error.set('Please select an Excel file (.xlsx or .xls)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        this.error.set('File size must be less than 10MB');
        return;
      }
      
      this.selectedFile.set(file);
      this.error.set(null);
    }
  }

  uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploadLoading.set(true);
    this.error.set(null);
    this.uploadResult.set(null);

    this.questionService.bulkUploadQuestions(this.quizId(), file).subscribe({
      next: (result) => {
        this.uploadResult.set(result);
        this.uploadLoading.set(false);
        this.clearUpload();
        this.loadQuestions();
      },
      error: (error) => {
        this.error.set(error.error?.message || 'Failed to upload questions');
        this.uploadLoading.set(false);
      }
    });
  }

  clearUpload() {
    this.selectedFile.set(null);
    this.uploadResult.set(null);
    const fileInput = document.getElementById('questionFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  downloadTemplate() {
    const csvContent = [
      'Question,Type,Option1,Option2,Option3,Option4,CorrectAnswers',
      'What is 2+2?,SingleChoice,2,3,4,5,3',
      'Select all programming languages,MultipleChoice,JavaScript,Python,HTML,CSS,"1,2"',
      'Is TypeScript a programming language?,SingleChoice,True,False,,,1'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'question_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getQuestionTypeLabel(type: QuestionType): string {
    return type === QuestionType.SingleChoice ? 'Single Choice' : 'Multiple Choice';
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
