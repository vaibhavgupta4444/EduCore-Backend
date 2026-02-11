import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-bank-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-bank-upload.component.html',
  styleUrls: ['./question-bank-upload.component.css']
})
export class QuestionBankUploadComponent {
  @Input() isLoading = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() uploadFile = new EventEmitter<void>();

  selectedFile = signal<File | null>(null);
  error = signal<string | null>(null);

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
        this.error.set('Please select an Excel file (.xlsx or .xls)');
        this.selectedFile.set(null);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.error.set('File size must be less than 10MB');
        this.selectedFile.set(null);
        return;
      }
      
      this.selectedFile.set(file);
      this.error.set(null);
      this.fileSelected.emit(file);
    }
  }

  onUpload() {
    if (this.selectedFile()) {
      this.uploadFile.emit();
    }
  }

  downloadTemplate() {
    // Create a sample Excel template with instructions
    const csvContent = [
      'Question Text,Option A,Option B,Option C,Option D,Correct Answer,Question Type,Explanation',
      'What is 2+2?,2,3,4,5,C,MultipleChoice,Basic arithmetic - the answer is 4',
      'JavaScript is a programming language,True,False,,,A,TrueFalse,JavaScript is indeed a programming language',
      'What does HTML stand for?,,,,,"HyperText Markup Language",ShortAnswer,HTML is the standard markup language for web pages',
      'Which of these is NOT a JavaScript data type?,String,Boolean,Number,Integer,D,MultipleChoice,JavaScript has String Boolean and Number but not Integer as a primitive type'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'question_bank_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  clearFile() {
    this.selectedFile.set(null);
    this.error.set(null);
    const fileInput = document.getElementById('questionBankFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}