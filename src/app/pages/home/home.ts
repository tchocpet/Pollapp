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
  get surveys(): Survey[] {
    return this.surveyService.getSurveys();
  }
  activeTab: 'running' | 'past' = 'running';
  selectedCategory = 'All';

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  constructor(private surveyService: SurveyService) {}

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

  setTab(tab: 'running' | 'past'): void {
    this.activeTab = tab;
  }
  deleteSurvey(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this survey?');

    if (!confirmed) {
      return;
    }

    this.surveyService.deleteSurvey(id);
  }

  get categories(): string[] {
    const categories = this.surveys
      .map((survey) => survey.category.trim())
      .filter((category) => category);

    return ['All', ...new Set(categories)];
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
}
