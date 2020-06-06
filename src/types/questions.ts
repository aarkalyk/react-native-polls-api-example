export type QuestionObject = {
  id: number;
  question: string;
  published_at: Date;
  choices: ChoiceObject[];
};

export type ChoiceObject = {
  id: number;
  questionId: number;
  choice: string;
  votes: number;
};
