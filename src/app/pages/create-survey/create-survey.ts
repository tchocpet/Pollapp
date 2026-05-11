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
  answers = ['', ''];
  questions: Question[] = [];
  errorMessage = '';

  constructor(
    private surveyService: SurveyService,
    private router: Router,
  ) {}

  addAnswer() {
    this.answers.push('');
  }

  removeAnswer(index: number) {
    if (this.answers.length > 2) {
      this.answers.splice(index, 1);
    }
  }

  addQuestion() {
    const hasEmptyAnswer = this.answers.some((answer) => answer.trim() === '');

    if (this.question.trim() === '' || hasEmptyAnswer) {
      this.errorMessage = 'Please fill the question and all answer options.';

      return;
    }

    this.questions.push({
      text: this.question,
      answers: this.answers.map((answer) => ({
        text: answer,
        votes: 0,
      })),
    });

    this.question = '';
    this.answers = ['', ''];
    this.errorMessage = '';
  }

  publishSurvey() {
    const hasEmptyAnswer = this.answers.some((answer) => answer.trim() === '');

    if (
      this.title.trim() === '' ||
      this.deadline.trim() === '' ||
      this.category.trim() === '' ||
      this.question.trim() === '' ||
      hasEmptyAnswer
    ) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (this.question.trim() !== '') {
      this.addQuestion();
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
    this.errorMessage = '';
    this.router.navigate(['/']);
  }
}
