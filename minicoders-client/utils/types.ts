export type Difficulty = "EASY" | "MEDIUM" | "HARD"; // match your Prisma enum

export type Problem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  createdAt: string;
};

export type ProblemsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProblemsData = {
  meta: ProblemsMeta;
  problems: Problem[];
};

export type ProblemsResponse = {
  success?: boolean;
  message?: string;
  data: ProblemsData;
};

export type ProblemsSearchParams = {
  search?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
};