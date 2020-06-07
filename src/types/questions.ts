// Question types
export type QuestionObject = {
  id: number;
  published_at: Date;
  choice_ids: number[];
} & Question;

export type QuestionObjectResponse = {
  url: string;
  published_at: string;
  choices: ChoiceObjectResponse[];
} & Question;

type Question = {
  question: string;
};

// Choice types
export type ChoiceObject = {
  id: number;
  questionId: number;
} & Choice;

export type ChoiceObjectResponse = {
  url: string;
} & Choice;

type Choice = {
  choice: string;
  votes: number;
};

// Questions url
export type QuestionsUrlResponse = {
  questions_url: string;
};
