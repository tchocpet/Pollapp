import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Survey[] = [
    {
      id: 1,
      title: 'Team Lunch',
      description: 'Vote for the next team lunch location.',
      deadline: '2026-06-20',
      category: 'Work',
      questions: [
        {
          text: 'Where should we eat?',
          allowMultipleAnswers: false,
          answers: [
            { text: 'Italian', votes: 3 },
            { text: 'Asian', votes: 5 },
            { text: 'Burger', votes: 2 },
          ],
        },
      ],
      isPast: false,
    },

    {
      id: 2,
      title: 'Office Event',
      description: 'Choose activities for the next event.',
      deadline: '2026-06-14',
      category: 'Event',
      questions: [
        {
          text: 'Best activity?',
          allowMultipleAnswers: true,
          answers: [
            { text: 'Bowling', votes: 4 },
            { text: 'Escape Room', votes: 6 },
          ],
        },
      ],
      isPast: false,
    },

    {
      id: 3,
      title: 'Retro Feedback',
      description: 'Sprint feedback survey.',
      deadline: '2025-01-12',
      category: 'Feedback',
      questions: [
        {
          text: 'How was the sprint?',
          allowMultipleAnswers: false,
          answers: [
            { text: 'Great', votes: 8 },
            { text: 'Needs work', votes: 2 },
          ],
        },
      ],
      isPast: true,
    },
  ];

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
