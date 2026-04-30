// frontend/types/question.ts

export interface QuestionAuthor {
  id: string;
  name: string | null;
  imageUrl: string | null;
}

export interface Question {
  id: string;
  question: string;
  answer: string | null;
  createdAt: string;
  updatedAt: string;
  user: QuestionAuthor | null;
}

export interface PaginatedQuestions {
  data: Question[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
