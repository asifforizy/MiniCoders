import { Difficulty } from "../../../prisma/generated/prisma/client";

export interface IUpdatedStatus {
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
}

export type TCreateProblemPayload = {
  title: string;
  description: string;
  difficulty: Difficulty;
  points?: number;
};
