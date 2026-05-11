import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../models/survey';
import { SurveyService } from '../../services/survey';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  surveys: Survey[] = [];
  activeTab: 'running' | 'past' = 'running';

  constructor(private surveyService: SurveyService) {
    this.surveys = this.surveyService.getSurveys();
  }

  get runningSurveys(): Survey[] {
    const today = new Date();

    return this.surveys.filter((survey) => new Date(survey.deadline) >= today);
  }

  get pastSurveys(): Survey[] {
    const today = new Date();

    return this.surveys.filter((survey) => new Date(survey.deadline) < today);
  }

  get endingSoonSurveys(): Survey[] {
    return [...this.runningSurveys]
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }

  setTab(tab: 'running' | 'past') {
    this.activeTab = tab;
  }
}
