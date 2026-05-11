import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../models/survey';
import { SurveyService } from '../../services/survey';

@Component({
  selector: 'app-survey-detail',
  imports: [],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  survey?: Survey;
  selectedIndex: number | null = null;
  currentQuestionIndex = 0;
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

  vote(index: number) {
    this.selectedIndex = index;
  }
  nextQuestion() {
    if (!this.survey) {
      return;
    }

    if (this.currentQuestionIndex < this.survey.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedIndex = null;
    }
  }

  completeSurvey() {
    if (!this.survey || this.selectedIndex === null) {
      return;
    }

    if (this.currentQuestion && this.selectedIndex !== null) {
      this.currentQuestion.answers[this.selectedIndex].votes++;
    }

    this.selectedIndex = null;
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
