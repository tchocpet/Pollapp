import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  @ViewChild('surveyFormElement') private surveyFormElement?: ElementRef<HTMLFormElement>;

  activeTab: 'running' | 'past' = 'running';
  selectedCategory = 'All';

  isCreateModalOpen = false;

  title = '';
  description = '';
  deadline = '';
  minDeadline = this.getDateInputValue(new Date());
  category = '';
  question = '';
  allowMultipleAnswers = false;
  showCurrentQuestion = true;
  showPublishOverlay = false;
  answers = ['', ''];
  questions: Question[] = [];
  answersError = '';

  titleError = '';
  deadlineError = '';
  categoryError = '';
  questionError = '';
  private modalHistoryEntryActive = false;
  private publishToastTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private surveyService: SurveyService,
    private router: Router,
  ) {
    const navigationState =
      this.router.getCurrentNavigation()?.extras.state ?? window.history.state;

    if (navigationState?.['openCreate']) {
      this.openCreateModal(false);
    }
  }

  get surveys(): Survey[] {
    return this.surveyService.getSurveys();
  }

  @HostListener('window:popstate')
  onBrowserBack(): void {
    if (!this.isCreateModalOpen) {
      return;
    }

    this.modalHistoryEntryActive = false;
    this.closeCreateModal(false);
  }

  openCreateModal(addHistoryEntry = true): void {
    if (this.isCreateModalOpen) {
      return;
    }

    this.isCreateModalOpen = true;

    if (addHistoryEntry) {
      window.history.pushState({ ...window.history.state, createModalOpen: true }, '', window.location.href);
      this.modalHistoryEntryActive = true;
    }
  }

  closeCreateModal(updateHistory = true): void {
    if (updateHistory && this.modalHistoryEntryActive) {
      this.modalHistoryEntryActive = false;
      window.history.back();
      return;
    }

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
    this.answersError = '';
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.splice(index, 1);
    }
  }

  addQuestion(): void {
    this.clearQuestionErrors();

    if (!this.showCurrentQuestion) {
      this.showCurrentQuestion = true;
      return;
    }

    if (!this.hasValidQuestion()) {
      return;
    }

    this.questions.push(this.createQuestion());
    this.resetCurrentQuestion();
    this.showCurrentQuestion = true;
    this.scrollCreateFormToTop();
  }

  clearQuestionOne(): void {
    this.resetCurrentQuestion();

    if (this.questions.length > 0) {
      this.showCurrentQuestion = false;
    }
  }

  private hasValidQuestion(): boolean {
    const filledAnswers = this.answers.filter((answer) => answer.trim() !== '');

    if (this.question.trim() === '') {
      this.questionError = 'Please add a question.';
      return false;
    }

    if (filledAnswers.length < 2) {
      this.answersError = 'Please add at least two answers.';
      return false;
    }

    return true;
  }

  private createQuestion(): Question {
    return {
      text: this.question.trim(),
      allowMultipleAnswers: this.allowMultipleAnswers,
      answers: this.answers
        .filter((answer) => answer.trim() !== '')
        .map((answer) => ({
          text: answer.trim(),
          votes: 0,
        })),
    };
  }

  removeQuestion(index: number): void {
    if (index < 0 || index >= this.questions.length) {
      return;
    }

    this.questions.splice(index, 1);
    this.clearQuestionErrors();
  }

  addAnswerToQuestion(questionIndex: number): void {
    this.questions[questionIndex].answers.push({ text: '', votes: 0 });
  }

  removeAnswerFromQuestion(questionIndex: number, answerIndex: number): void {
    const answers = this.questions[questionIndex].answers;

    if (answers.length > 2) {
      answers.splice(answerIndex, 1);
    }
  }

  publishSurvey(): void {
    this.clearFieldErrors();

    if (!this.validateSurveyFields()) {
      return;
    }

    if (this.showCurrentQuestion && this.hasCurrentQuestionContent()) {
      if (!this.hasValidQuestion()) {
        return;
      }

      this.questions.push(this.createQuestion());
      this.resetCurrentQuestion();
    }

    if (this.questions.length === 0) {
      this.questionError = 'At least one question is required.';
      return;
    }

    this.saveSurvey();
    this.closeCreateModal(false);
    this.showPublishOverlay = true;
    clearTimeout(this.publishToastTimer);
    this.publishToastTimer = setTimeout(() => {
      this.showPublishOverlay = false;
    }, 5000);
    this.router.navigate(['/']);
  }

  private hasCurrentQuestionContent(): boolean {
    return this.question.trim() !== '' || this.answers.some((answer) => answer.trim() !== '');
  }

  private saveSurvey(): Survey {
    const survey: Survey = {
      id: Date.now(),
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      category: this.category,
      questions: this.questions,
      isPast: false,
    };

    this.surveyService.addSurvey(survey);

    return survey;
  }

  private resetForm(): void {
    this.resetSurveyFields();
    this.questions = [];
    this.clearFieldErrors();
  }

  private resetSurveyFields(): void {
    this.title = '';
    this.description = '';
    this.deadline = '';
    this.category = '';
    this.resetCurrentQuestion();
    this.showCurrentQuestion = true;
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

    this.showCurrentQuestion = true;
  }

  private getDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

  private validateSurveyFields(): boolean {
    this.validateTitle();
    this.validateCategory();

    if (this.deadline.trim() !== '') {
      this.hasValidDeadline();
    }

    return !this.titleError && !this.deadlineError && !this.categoryError;
  }

  private validateTitle(): void {
    if (this.title.trim() === '') {
      this.titleError = 'Title is required.';
    }
  }

  private validateCategory(): void {
    if (this.category.trim() === '') {
      this.categoryError = 'Category is required.';
    }
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
  getAnswerLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  private clearQuestionErrors(): void {
    this.questionError = '';
    this.answersError = '';
  }

  private resetCurrentQuestion(): void {
    this.question = '';
    this.answers = ['', ''];
    this.allowMultipleAnswers = false;
    this.clearQuestionErrors();
  }

  private scrollCreateFormToTop(): void {
    setTimeout(() => {
      this.surveyFormElement?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  getEndsInText(deadline: string): string {
    const today = new Date();
    const endDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Ended on ${this.formatDate(deadline)}`;
    }

    if (diffDays === 0) {
      return 'Ends today';
    }

    if (diffDays === 1) {
      return 'Ends in 1 Day';
    }

    return `Ends in ${diffDays} Days`;
  }

  private formatDate(date: string): string {
    const [year, month, day] = date.split('-');

    return `${day}.${month}.${year}`;
  }
}
