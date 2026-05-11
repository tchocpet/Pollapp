import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Survey[] = [];

  constructor() {
    const savedSurveys = localStorage.getItem('surveys');

    if (savedSurveys) {
      this.surveys = JSON.parse(savedSurveys);
    }
  }

  getSurveys(): Survey[] {
    return this.surveys;
  }

  getSurveyById(id: number): Survey | undefined {
    return this.surveys.find((survey) => survey.id === id);
  }

  addSurvey(survey: Survey): void {
    this.surveys.push(survey);

    localStorage.setItem('surveys', JSON.stringify(this.surveys));
  }

  deleteSurvey(id: number): void {
    this.surveys = this.surveys.filter((survey) => survey.id !== id);

    localStorage.setItem('surveys', JSON.stringify(this.surveys));
  }

  saveSurveys(): void {
    localStorage.setItem('surveys', JSON.stringify(this.surveys));
  }
}
