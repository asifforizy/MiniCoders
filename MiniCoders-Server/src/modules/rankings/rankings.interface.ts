export type TRankingEntry = {
  rank: number;
  userId: string;
  name: string;
  imageUrl: string;
  solvedCount: number;
  lastSolvedAt: Date;
};

export type TRankingsResult = {
  rankings: TRankingEntry[];
  totalParticipants: number;
};
