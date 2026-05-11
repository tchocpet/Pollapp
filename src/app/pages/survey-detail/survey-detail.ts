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

  vote(index: number) {
    if (this.survey && this.currentQuestionIndex === this.survey.questions.length - 1) {
      this.surveyCompleted = true;
    }
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

  completeSurvey(): void {
    if (!this.survey || !this.currentQuestion) {
      return;
    }

    if (this.currentQuestion.allowMultipleAnswers) {
      if (this.selectedIndexes.length === 0) {
        return;
      }

      const currentQuestion = this.currentQuestion;

      if (!currentQuestion) {
        return;
      }

      this.selectedIndexes.forEach((index) => {
        currentQuestion.answers[index].votes++;
      });
    } else {
      if (this.selectedIndex === null) {
        return;
      }

      this.currentQuestion.answers[this.selectedIndex].votes++;
    }

    this.surveyService.saveSurveys();

    this.selectedIndex = null;
    this.selectedIndexes = [];

    if (this.currentQuestionIndex < this.survey.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.surveyCompleted = true;
    }
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
