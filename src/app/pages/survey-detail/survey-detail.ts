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
  selectedAnswersByQuestion: number[][] = [];
  surveyCompleted = false;
  hasVoted = false;
  showVoteToast = false;
  private surveyId = 0;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
  ) {
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));
    this.survey = this.surveyService.getSurveyById(this.surveyId);
    this.hasVoted = localStorage.getItem(this.getVoteKey()) === 'true';
    this.surveyCompleted = this.hasVoted;
  }

  private getVoteKey(): string {
    return `survey-voted-${this.surveyId}`;
  }

  completeSurvey(): void {
    if (!this.survey || this.hasVoted || !this.hasSelectedAnswers()) {
      return;
    }

    this.selectedAnswersByQuestion.forEach((answerIndexes, questionIndex) => {
      const question = this.survey?.questions[questionIndex];

      answerIndexes.forEach((answerIndex) => {
        const answer = question?.answers[answerIndex];

        if (answer) {
          answer.votes++;
        }
      });
    });

    this.surveyService.saveSurveys();
    this.hasVoted = true;
    this.surveyCompleted = true;
    localStorage.setItem(this.getVoteKey(), 'true');
    this.showVoteToast = true;
  }

  hasSelectedAnswers(): boolean {
    return this.selectedAnswersByQuestion.some((answerIndexes) => answerIndexes.length > 0);
  }

  getQuestionPercentage(question: Survey['questions'][number], votes: number): number {
    const totalVotes = question.answers.reduce((sum, answer) => sum + answer.votes, 0);

    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  }

  voteForQuestion(questionIndex: number, answerIndex: number, event: Event): void {
    if (!this.survey || this.hasVoted) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const question = this.survey.questions[questionIndex];

    if (!question) {
      return;
    }

    const selectedAnswers = this.selectedAnswersByQuestion[questionIndex] ?? [];

    if (question.allowMultipleAnswers) {
      this.selectedAnswersByQuestion[questionIndex] = input.checked
        ? [...selectedAnswers, answerIndex]
        : selectedAnswers.filter((selectedIndex) => selectedIndex !== answerIndex);
      return;
    }

    this.selectedAnswersByQuestion[questionIndex] = input.checked ? [answerIndex] : [];
  }

  closeVoteToast(): void {
    this.showVoteToast = false;
  }

  isAnswerSelected(questionIndex: number, answerIndex: number): boolean {
    return this.selectedAnswersByQuestion[questionIndex]?.includes(answerIndex) ?? false;
  }
}
