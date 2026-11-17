export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT"; // match your Prisma enum

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

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "KIDS";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminProblem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type AdminStats = {
  totals: {
    users: number;
    kids: number;
    admins: number;
    superAdmins: number;
    problems: number;
  };
  roles: { label: string; value: number }[];
  statuses: {
    active: number;
    blocked: number;
    deleted: number;
  };
  registrations: { label: string; count: number }[];
};

export type CreateProblemPayload = {
  title: string;
  description: string;
  difficulty: Difficulty;
  points?: number;
};