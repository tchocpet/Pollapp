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
  get currentQuestion() {
    return this.survey?.questions[this.currentQuestionIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.survey = this.surveyService.getSurveyById(id);
  }

  vote(index: number): void {
    if (this.currentQuestion?.allowMultipleAnswers) {
      if (this.selectedIndexes.includes(index)) {
        this.selectedIndexes = this.selectedIndexes.filter(
          (selectedIndex) => selectedIndex !== index,
        );
      } else {
        this.selectedIndexes.push(index);
      }

      return;
    }

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
    if (!this.canSubmitAnswer()) {
      return;
    }

    this.saveCurrentAnswer();
    this.surveyService.saveSurveys();
    this.resetSelectedAnswers();
    this.goToNextStep();
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
    if (!this.survey) {
      return 0;
    }

    return this.survey.questions[0].answers.reduce((sum, answer) => sum + answer.votes, 0);
  }

  getPercentage(votes: number): number {
    const totalVotes = this.getTotalVotes();
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  }
}
