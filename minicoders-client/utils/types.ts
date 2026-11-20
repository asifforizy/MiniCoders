export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT"; // match your Prisma enum

export type Language = "python" | "javascript" | "cpp" | "java";

export type Problem = {
  id: string;
  number: number | null;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topic: string | null;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  isSolved?: boolean;
};

export type ProblemsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProblemsData = {
  meta: ProblemsMeta;
  topics: string[];
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
  topic?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
};

export type ProblemAuthor = {
  id: string;
  name: string;
  imageUrl: string;
};

export type PublicTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  order: number;
  explanation: string | null;
};

export type ProblemDetail = Problem & {
  updatedAt: string;
  author: ProblemAuthor;
  inputFormat: string | null;
  outputFormat: string | null;
  constraints: string | null;
  hints: string[];
  starterCode: Partial<Record<Language, string>> | null;
  supportedLanguages: Language[];
  testCases: PublicTestCase[];
  isSolved: boolean;
};

export type SubmissionStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "INTERNAL_ERROR";

export type TestCaseResult = {
  order: number;
  isPublic: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput: string;
  passed: boolean;
  status: SubmissionStatus;
  time: number | null;
  memory: number | null;
  stderr: string;
  compileOutput: string;
};

export type RunResult = {
  problemId: string;
  verdict: SubmissionStatus;
  passed: number;
  total: number;
  time: number | null;
  memory: number | null;
  message: string;
  results: TestCaseResult[];
};

export type CustomRunResult = {
  problemId: string;
  status: SubmissionStatus;
  statusDescription: string;
  output: string;
  stderr: string;
  compileOutput: string;
  message: string;
  time: number | null;
  memory: number | null;
};

export type SubmissionSummary = {
  id: string;
  status: SubmissionStatus;
  language: string;
  passedTestCases: number;
  totalTestCases: number;
  time: number | null;
  memory: number | null;
  message: string | null;
  score: number | null;
  createdAt: string;
  problem?: {
    id: string;
    number: number | null;
    title: string;
    slug: string;
    difficulty: Difficulty;
  };
};

export type SubmitResult = SubmissionSummary & {
  verdict: SubmissionStatus;
  passed: number;
  total: number;
  results: TestCaseResult[];
};

export type SubmissionDetail = SubmissionSummary & {
  code: string;
};

export type SubmissionsData = {
  meta: ProblemsMeta;
  submissions: SubmissionSummary[];
};

export type ProblemProgress = {
  problem: {
    id: string;
    number: number | null;
    title: string;
    slug: string;
    difficulty: Difficulty;
    topic: string | null;
  };
  solved: boolean;
  attempts: number;
  solvedAt: string | null;
  lastAttemptAt: string | null;
};

export type UserProgress = {
  totals: {
    solved: number;
    attempts: number;
    totalPublished: number;
    completion: number;
  };
  solvedProblemIds: string[];
  problems: ProblemProgress[];
};

export type ProblemDetailResponse = {
  success?: boolean;
  message?: string;
  data: ProblemDetail;
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
  number: number | null;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topic: string | null;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    submissions: number;
    testCases: number;
  };
};

export type AdminProblemTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  order: number;
  explanation: string | null;
};

export type AdminProblemDetail = AdminProblem & {
  inputFormat: string | null;
  outputFormat: string | null;
  constraints: string | null;
  hints: string[];
  starterCode: Partial<Record<Language, string>> | null;
  supportedLanguages: Language[];
  testCases: AdminProblemTestCase[];
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

export type AdminTestCasePayload = {
  input: string;
  expectedOutput: string;
  isPublic?: boolean;
  explanation?: string;
  order?: number;
};

export type CreateProblemPayload = {
  title: string;
  description: string;
  difficulty: Difficulty;
  points?: number;
  number?: number;
  topic?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  hints?: string[];
  starterCode?: Partial<Record<Language, string>>;
  supportedLanguages?: Language[];
  timeLimit?: number;
  memoryLimit?: number;
  isPublished?: boolean;
  testCases?: AdminTestCasePayload[];
};

export type UpdateProblemPayload = Partial<CreateProblemPayload>;

export type AdminPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUsersQuery = {
  search?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
};

export type AdminProblemsQuery = {
  search?: string;
  difficulty?: string;
  published?: string;
  page?: string;
  limit?: string;
};

export type AdminUsersData = {
  users: AdminUser[];
  meta: AdminPaginationMeta;
};

export type AdminProblemsData = {
  problems: AdminProblem[];
  meta: AdminPaginationMeta;
};