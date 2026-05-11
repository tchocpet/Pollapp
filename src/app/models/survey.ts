export interface Answer {
  text: string;
  votes: number;
}

export interface Question {
  text: string;
  allowMultipleAnswers: boolean;
  answers: Answer[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  deadline: string;
  category: string;
  questions: Question[];
  isPast: boolean;
}
