import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Survey } from '../../models/survey';
import { SurveyService } from '../../services/survey';

@Component({
  selector: 'app-survey-detail',
  imports: [RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  survey?: Survey;
  selectedIndex: number | null = null;
  selectedIndexes: number[] = [];
  currentQuestionIndex = 0;
  surveyCompleted = false;
  hasVoted = false;
  private surveyId = 0;
  get currentQuestion() {
    return this.survey?.questions[this.currentQuestionIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
  ) {
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));
    this.survey = this.surveyService.getSurveyById(this.surveyId);
    this.hasVoted = localStorage.getItem(this.getVoteKey()) === 'true';
  }

  private getVoteKey(): string {
    return `survey-voted-${this.surveyId}`;
  }

  vote(index: number): void {
    if (this.hasVoted || !this.currentQuestion) {
      return;
    }

    if (this.currentQuestion.allowMultipleAnswers) {
      this.toggleMultipleVote(index);
      return;
    }

    this.setSingleVote(index);
    this.surveyService.saveSurveys();
  }

  private toggleMultipleVote(index: number): void {
    const exists = this.selectedIndexes.includes(index);

    if (exists) {
      this.currentQuestion!.answers[index].votes--;
      this.selectedIndexes = this.selectedIndexes.filter((selected) => selected !== index);
      this.surveyService.saveSurveys();
      return;
    }

    this.currentQuestion!.answers[index].votes++;
    this.selectedIndexes.push(index);
    this.surveyService.saveSurveys();
  }

  private setSingleVote(index: number): void {
    if (this.selectedIndex !== null) {
      this.currentQuestion!.answers[this.selectedIndex].votes--;
    }

    this.currentQuestion!.answers[index].votes++;
    this.selectedIndex = index;
  }

  nextQuestion(): void {
    if (!this.survey) {
      return;
    }

    if (this.currentQuestionIndex < this.survey.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedIndex = null;
    }
  }

  completeSurvey(): void {
    this.hasVoted = true;
    this.surveyCompleted = true;
    localStorage.setItem(this.getVoteKey(), 'true');
  }

  private canSubmitAnswer(): boolean {
    if (!this.survey || !this.currentQuestion) {
      return false;
    }

    return this.currentQuestion.allowMultipleAnswers
      ? this.selectedIndexes.length > 0
      : this.selectedIndex !== null;
  }

  private saveCurrentAnswer(): void {
    if (this.currentQuestion?.allowMultipleAnswers) {
      this.saveMultipleAnswers();
      return;
    }

    this.saveSingleAnswer();
  }

  private saveMultipleAnswers(): void {
    this.selectedIndexes.forEach((index) => {
      this.currentQuestion!.answers[index].votes++;
    });
  }

  private saveSingleAnswer(): void {
    if (this.selectedIndex !== null) {
      this.currentQuestion!.answers[this.selectedIndex].votes++;
    }
  }

  private resetSelectedAnswers(): void {
    this.selectedIndex = null;
    this.selectedIndexes = [];
  }

  private goToNextStep(): void {
    if (!this.survey) {
      return;
    }

    if (this.currentQuestionIndex < this.survey.questions.length - 1) {
      this.currentQuestionIndex++;
      return;
    }

    this.surveyCompleted = true;
  }

  getTotalVotes(): number {
    return this.currentQuestion?.answers.reduce((sum, answer) => sum + answer.votes, 0) ?? 0;
  }

  getPercentage(votes: number): number {
    const totalVotes = this.getTotalVotes();

    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  }

  getQuestionPercentage(question: any, votes: number): number {
    const totalVotes = question.answers.reduce((sum: number, answer: any) => sum + answer.votes, 0);

    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  }

  voteForQuestion(questionIndex: number, answerIndex: number, event: Event): void {
    if (!this.survey) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const question = this.survey.questions[questionIndex];

    if (!question) {
      return;
    }

    if (input.checked) {
      question.answers[answerIndex].votes++;
    } else {
      question.answers[answerIndex].votes--;
    }

    if (question.answers[answerIndex].votes < 0) {
      question.answers[answerIndex].votes = 0;
    }

    this.surveyService.saveSurveys();
  }
}
