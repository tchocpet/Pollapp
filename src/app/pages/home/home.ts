import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Question, Survey } from '../../models/survey';
import { SurveyService } from '../../services/survey';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  activeTab: 'running' | 'past' = 'running';
  selectedCategory = 'All';

  isCreateModalOpen = false;

  title = '';
  description = '';
  deadline = '';
  category = '';
  question = '';
  allowMultipleAnswers = false;
  showSecondQuestion = false;
  showPublishOverlay = false;
  answers = ['', ''];
  secondAnswers = ['', ''];
  questions: Question[] = [];
  errorMessage = '';
  answersError = '';

  titleError = '';
  deadlineError = '';
  categoryError = '';
  questionError = '';

  constructor(private surveyService: SurveyService) {}

  get surveys(): Survey[] {
    return this.surveyService.getSurveys();
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.resetForm();
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  setTab(tab: 'running' | 'past'): void {
    this.activeTab = tab;
  }

  get runningSurveys(): Survey[] {
    return this.filterSurveysByDate(true);
  }

  get pastSurveys(): Survey[] {
    return this.filterSurveysByDate(false);
  }

  private filterSurveysByDate(isRunning: boolean): Survey[] {
    const today = this.getToday();

    return this.surveys.filter((survey) => {
      const deadline = this.getDateOnly(survey.deadline);

      return isRunning ? deadline >= today : deadline < today;
    });
  }

  get endingSoonSurveys(): Survey[] {
    const today = this.getToday();
    const limit = this.getEndingSoonLimit(today);

    return this.surveys
      .filter((survey) => this.isEndingSoon(survey, today, limit))
      .sort((a, b) => this.getTime(a.deadline) - this.getTime(b.deadline))
      .slice(0, 3);
  }

  private getEndingSoonLimit(today: Date): Date {
    const limit = new Date(today);
    limit.setDate(today.getDate() + 30);

    return limit;
  }

  private isEndingSoon(survey: Survey, today: Date, limit: Date): boolean {
    const deadline = this.getDateOnly(survey.deadline);

    return deadline >= today && deadline <= limit;
  }

  get categories(): string[] {
    return ['All', ...new Set(this.getSurveyCategories())];
  }

  private getSurveyCategories(): string[] {
    return this.surveys.map((survey) => survey.category.trim()).filter((category) => category);
  }

  get filteredRunningSurveys(): Survey[] {
    if (this.selectedCategory === 'All') {
      return this.runningSurveys;
    }

    return this.runningSurveys.filter((survey) => survey.category === this.selectedCategory);
  }

  get filteredPastSurveys(): Survey[] {
    if (this.selectedCategory === 'All') {
      return this.pastSurveys;
    }

    return this.pastSurveys.filter((survey) => survey.category === this.selectedCategory);
  }

  deleteSurvey(id: number): void {
    if (!this.hasDeleteConfirmation()) {
      return;
    }

    this.surveyService.deleteSurvey(id);
  }

  private hasDeleteConfirmation(): boolean {
    return confirm('Are you sure you want to delete this survey?');
  }

  addAnswer(): void {
    this.answers.push('');
  }

  addSecondAnswer(): void {
    this.secondAnswers.push('');
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.splice(index, 1);
    }
  }

  addQuestion(): void {
    if (!this.hasValidQuestion()) {
      return;
    }

    this.questions.push(this.createQuestion());

    this.question = '';
    this.answers = ['', ''];
    this.allowMultipleAnswers = false;
    this.errorMessage = '';
  }

  showQuestionTwo(): void {
    this.showSecondQuestion = true;
  }

  clearQuestionOne(): void {
    this.question = '';
    this.answers = ['', ''];
    this.allowMultipleAnswers = false;
  }

  removeSecondQuestion(): void {
    this.showSecondQuestion = false;
  }

  private hasValidQuestion(): boolean {
    const hasEmptyAnswer = this.answers.some((answer) => answer.trim() === '');

    if (this.question.trim() === '' || hasEmptyAnswer) {
      this.answersError = 'All answer options are required.';
      return false;
    }

    return true;
  }

  private createQuestion(): Question {
    return {
      text: this.question,
      allowMultipleAnswers: this.allowMultipleAnswers,
      answers: this.answers.map((answer) => ({
        text: answer,
        votes: 0,
      })),
    };
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  publishSurvey(): void {
    this.prepareSurveySubmit();

    if (!this.isSurveyFormValid()) {
      return;
    }

    this.saveSurvey();
    this.showPublishOverlay = true;
  }

  private prepareSurveySubmit(): void {
    this.clearFieldErrors();
    this.errorMessage = '';

    if (this.question.trim() !== '') {
      this.addQuestion();
    }
  }

  private isSurveyFormValid(): boolean {
    return this.validateRequiredFields();
  }

  private saveSurvey(): void {
    this.surveyService.addSurvey({
      id: Date.now(),
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      category: this.category,
      questions: this.questions,
      isPast: false,
    });
  }

  private resetForm(): void {
    this.resetSurveyFields();
    this.questions = [];
    this.errorMessage = '';
    this.clearFieldErrors();
  }

  private resetSurveyFields(): void {
    this.title = '';
    this.description = '';
    this.deadline = '';
    this.category = '';
    this.question = '';
    this.allowMultipleAnswers = false;
    this.answers = ['', ''];
  }

  private clearFieldErrors(): void {
    this.titleError = '';
    this.deadlineError = '';
    this.categoryError = '';
    this.questionError = '';
    this.answersError = '';
  }

  resetSurveyForm(): void {
    this.title = '';
    this.description = '';
    this.deadline = '';
    this.category = '';

    this.question = '';
    this.answers = ['', ''];
    this.allowMultipleAnswers = false;

    this.questions = [];

    this.showSecondQuestion = false;
    this.showPublishOverlay = false;
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today;
  }

  private getDateOnly(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    const parsedDate = new Date(year, month - 1, day);
    parsedDate.setHours(0, 0, 0, 0);

    return parsedDate;
  }

  private getTime(date: string): number {
    return new Date(date).getTime();
  }

  private validateRequiredFields(): boolean {
    this.validateTitle();
    this.validateQuestions();

    return !this.hasFieldErrors();
  }

  private validateTitle(): void {
    if (this.title.trim() === '') {
      this.titleError = 'Title is required.';
    }
  }

  private validateDeadline(): void {
    if (this.deadline.trim() === '') {
      this.deadlineError = 'Deadline is required.';
    }
  }

  private validateCategory(): void {
    if (this.category.trim() === '') {
      this.categoryError = 'Category is required.';
    }
  }

  private validateQuestions(): void {
    if (this.questions.length === 0) {
      this.questionError = 'At least one question is required.';
    }
  }

  private hasFieldErrors(): boolean {
    return Boolean(
      this.titleError || this.deadlineError || this.categoryError || this.questionError,
    );
  }

  private hasValidDeadline(): boolean {
    const today = this.getToday();
    const selectedDeadline = this.getDateOnly(this.deadline);

    if (selectedDeadline < today) {
      this.deadlineError = 'Deadline cannot be in the past.';
      return false;
    }

    return true;
  }
}
