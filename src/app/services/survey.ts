import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Survey[] = [
    {
      id: 1,
      title: "Let's Plan the Next Team Event Together",
      description:
        'We want to create team activities that everyone will enjoy - share your preferences and ideas in our survey to help us plan better experiences together.',
      deadline: '2026-06-20',
      category: 'Team activities',
      questions: [
        {
          text: 'Which date would work best for you?',
          allowMultipleAnswers: false,
          answers: [
            { text: '19.09.2025, Friday', votes: 3 },
            { text: '10.10.2025, Friday', votes: 5 },
            { text: '11.10.2025, Saturday', votes: 1 },
            { text: '31.10.2025, Friday', votes: 3 },
          ],
        },
        {
          text: 'Choose the activities you prefer?',
          allowMultipleAnswers: true,
          answers: [
            { text: 'Outdoor adventure like kayaking', votes: 6 },
            { text: 'Office Costume Party', votes: 0 },
            { text: 'Bowling, mini-golf, volleyball', votes: 2 },
            { text: 'Beach party, music & cocktails', votes: 3 },
            { text: 'Escape room', votes: 0 },
          ],
        },
      ],
      isPast: false,
    },
    {
      id: 2,
      title: 'Gaming habits and favorite games!',
      description: 'Tell us which games and play styles your group enjoys most.',
      deadline: '2026-06-22',
      category: 'Gaming',
      questions: [
        {
          text: 'Which game night style do you prefer?',
          allowMultipleAnswers: true,
          answers: [
            { text: 'Co-op games', votes: 4 },
            { text: 'Party games', votes: 6 },
            { text: 'Strategy games', votes: 3 },
          ],
        },
      ],
      isPast: false,
    },
    {
      id: 3,
      title: 'Healthier future: Fit & wellness survey!',
      description: 'Share your wellness interests and help plan healthy activities.',
      deadline: '2026-06-21',
      category: 'Healthy Lifestyle',
      questions: [
        {
          text: 'What wellness activity sounds best?',
          allowMultipleAnswers: true,
          answers: [
            { text: 'Team yoga', votes: 2 },
            { text: 'Healthy cooking', votes: 5 },
            { text: 'Walking challenge', votes: 4 },
          ],
        },
      ],
      isPast: false,
    },
    {
      id: 4,
      title: 'Retro Feedback',
      description: 'Sprint feedback survey.',
      deadline: '2026-06-14',
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
