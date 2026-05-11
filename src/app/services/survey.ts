import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Survey[] = [
    {
      id: 1,
      title: 'Team Event',
      description: 'Choose activities for the event',
      deadline: '2026-05-20',
      category: 'Work',

      questions: [
        {
          text: 'Which date would work best for you?',
          answers: [
            {
              text: '19.09.2026 Friday',
              votes: 2,
            },
            {
              text: '10.10.2026 Friday',
              votes: 5,
            },
            {
              text: '11.10.2026 Saturday',
              votes: 1,
            },
          ],
        },
      ],

      isPast: false,
    },
  ];

  getSurveys(): Survey[] {
    return this.surveys;
  }

  getSurveyById(id: number): Survey | undefined {
    return this.surveys.find((survey) => survey.id === id);
  }

  addSurvey(survey: Survey): void {
    this.surveys.push(survey);
  }
}
