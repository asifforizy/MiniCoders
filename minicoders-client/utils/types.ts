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

export type RankingEntry = {
  rank: number;
  userId: string;
  name: string;
  imageUrl: string;
  solvedCount: number;
  lastSolvedAt: string;
};

export type RankingsData = {
  rankings: RankingEntry[];
  totalParticipants: number;
};

export type RankingsResponse = {
  success?: boolean;
  message?: string;
  data: RankingsData;
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "KIDS";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export type KidsProfile = {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  address: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  googleId: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  imageUrl: string;
  imagePublicId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  kids: KidsProfile | null;
};

export type GetMeResponse =
  | {
      success: true;
      statusCode?: number;
      message: string;
      data: UserProfile;
    }
  | {
      success: false;
      statusCode?: number;
      message: string;
      data?: undefined;
    };

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