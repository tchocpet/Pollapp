import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private readonly storageVersionKey = 'surveysVersion';
  private readonly currentStorageVersion = 'figma-defaults-v4';

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
        {
          text: "What's most important to you in a team event?",
          allowMultipleAnswers: true,
          answers: [
            { text: 'Team bonding', votes: 5 },
            { text: 'Food and drinks', votes: 0 },
            { text: 'Trying something new', votes: 3 },
            { text: 'Keeping it low-key and stress-free', votes: 3 },
          ],
        },
        {
          text: 'How long would you prefer the event to last?',
          allowMultipleAnswers: false,
          answers: [
            { text: 'Half a day', votes: 2 },
            { text: 'Full day', votes: 12 },
            { text: 'Evening only', votes: 0 },
          ],
        },
      ],
      isPast: false,
    },
    {
      id: 2,
      title: 'Fit & wellness survey!',
      description: 'Help us choose wellness activities that fit the whole team.',
      deadline: '2026-06-21',
      category: 'Health & Wellness',
      questions: [
        {
          text: 'Which wellness activity sounds best?',
          allowMultipleAnswers: true,
          answers: [
            { text: 'Team yoga', votes: 3 },
            { text: 'Healthy cooking', votes: 4 },
            { text: 'Walking challenge', votes: 5 },
          ],
        },
      ],
      isPast: false,
    },
    {
      id: 3,
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
      id: 4,
      title: 'Healthier future: Fit & wellness survey!',
      description: 'Share your wellness interests and help plan healthy activities.',
      deadline: '2026-06-24',
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
      id: 5,
      title: "Let's Plan the Next Team Event Together",
      description:
        'We want to create team activities that everyone will enjoy - share your preferences and ideas in our survey to help us plan better experiences together.',
      deadline: '2026-06-24',
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
      ],
      isPast: false,
    },
    {
      id: 6,
      title: 'Gaming habits and favorite games!',
      description: 'Tell us which games and play styles your group enjoys most.',
      deadline: '2026-06-23',
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
      id: 7,
      title: 'Test Survey – Completed',
      description: 'This survey is for testing completed surveys.',
      deadline: '2026-11-13',
      category: 'Team activities',
      questions: [
        {
          text: 'Did you enjoy this test survey?',
          allowMultipleAnswers: false,
          answers: [
            { text: 'Yes', votes: 5 },
            { text: 'No', votes: 2 },
          ],
        },
      ],
      isPast: true,
    },
  ];

  constructor() {
    const savedSurveys = localStorage.getItem('surveys');
    const savedVersion = localStorage.getItem(this.storageVersionKey);

    if (savedSurveys) {
      this.surveys = JSON.parse(savedSurveys);

      if (savedVersion !== this.currentStorageVersion) {
        this.updateDemoSurveyDeadlines();
        localStorage.setItem(this.storageVersionKey, this.currentStorageVersion);
      }

      if (!this.surveys.some((survey) => survey.id === 7)) {
        this.surveys.push({
          id: 7,
          title: 'Test Survey – Completed',
          description: 'This survey is for testing completed surveys.',
          deadline: '2026-11-13',
          category: 'Team activities',
          questions: [
            {
              text: 'Did you enjoy this test survey?',
              allowMultipleAnswers: false,
              answers: [
                { text: 'Yes', votes: 5 },
                { text: 'No', votes: 2 },
              ],
            },
          ],
          isPast: true,
        });
      }

      this.saveSurveys();
      return;
    }

    this.updateDemoSurveyDeadlines();
    this.saveSurveys();

    localStorage.setItem(this.storageVersionKey, this.currentStorageVersion);
  }

  private updateDemoSurveyDeadlines(): void {
    const demoDeadlines = new Map<number, number>([
      [1, 7],
      [2, 10],
      [3, 14],
      [4, 21],
      [5, 25],
      [6, 30],
    ]);

    this.surveys.forEach((survey) => {
      const daysToAdd = demoDeadlines.get(survey.id);

      if (daysToAdd !== undefined) {
        survey.deadline = this.getDateAfterDays(daysToAdd);
        survey.isPast = false;
      }
    });
  }

  private getDateAfterDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
