import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey';
import { Question } from '../../models/survey';

@Component({
  selector: 'app-create-survey',
  imports: [RouterLink, FormsModule],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  title = '';
  description = '';
  deadline = '';
  category = '';
  question = '';
  allowMultipleAnswers = false;
  answers = ['', ''];
  questions: Question[] = [];
  errorMessage = '';

  constructor(
    private surveyService: SurveyService,
    private router: Router,
  ) {}

  addAnswer(): void {
    this.answers.push('');
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.splice(index, 1);
    }
  }

  addQuestion(): void {
    const hasEmptyAnswer = this.answers.some((answer) => answer.trim() === '');

    if (this.question.trim() === '' || hasEmptyAnswer) {
      this.errorMessage = 'Please fill the question and all answer options.';
      return;
    }

    this.questions.push({
      text: this.question,
      allowMultipleAnswers: this.allowMultipleAnswers,

      answers: this.answers.map((answer) => ({
        text: answer,
        votes: 0,
      })),
    });

    this.question = '';
    this.answers = ['', ''];
    this.errorMessage = '';
    this.allowMultipleAnswers = false;
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  publishSurvey(): void {
    if (this.questions.length === 0 && this.question.trim() === '') {
      this.errorMessage = 'Please add at least one question.';
      return;
    }
    if (this.question.trim() !== '') {
      this.addQuestion();
    }

    if (
      this.title.trim() === '' ||
      this.deadline.trim() === '' ||
      this.category.trim() === '' ||
      this.questions.length === 0
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.surveyService.addSurvey({
      id: Date.now(),
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      category: this.category,
      questions: this.questions,
      isPast: false,
    });

    this.title = '';
    this.description = '';
    this.deadline = '';
    this.category = '';
    this.question = '';
    this.answers = ['', ''];
    this.questions = [];
    this.errorMessage = '';

    this.router.navigate(['/']);
  }
}
