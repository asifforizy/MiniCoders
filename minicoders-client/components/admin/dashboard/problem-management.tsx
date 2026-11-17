"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createProblem, deleteProblem } from "@/services/adminApi";
import type { AdminProblem, Difficulty } from "@/utils/types";

type ProblemManagementProps = {
  problems: AdminProblem[];
};

const difficultyClasses: Record<Difficulty, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HARD: "bg-red-500/10 text-red-600 dark:text-red-400",
  EXPERT: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const difficultyOptions: Difficulty[] = ["EASY", "MEDIUM", "HARD", "EXPERT"];

export function ProblemManagement({ problems }: ProblemManagementProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [points, setPoints] = useState("100");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDifficulty("EASY");
    setPoints("100");
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsCreating(true);

    const parsedPoints = Number(points);

    const result = await createProblem({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      points:
        points.trim() && Number.isFinite(parsedPoints)
          ? parsedPoints
          : undefined,
    });

    setIsCreating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Problem created successfully");
    resetForm();
    router.refresh();
  };

  const handleDelete = async (problem: AdminProblem) => {
    if (!window.confirm(`Delete "${problem.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(problem.id);

    const result = await deleteProblem(problem.id);

    setDeletingId(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Problem deleted successfully");
    router.refresh();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Problem management</CardTitle>
          <CardDescription>
            {problems.length} problem{problems.length === 1 ? "" : "s"} in the
            platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Problem</th>
                  <th className="px-3 py-2.5 font-medium">Difficulty</th>
                  <th className="px-3 py-2.5 font-medium">Points</th>
                  <th className="px-3 py-2.5 font-medium">Author</th>
                  <th className="px-3 py-2.5 font-medium">Created</th>
                  <th className="px-3 py-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-12 text-center text-muted-foreground"
                    >
                      No problems yet. Create the first one.
                    </td>
                  </tr>
                ) : (
                  problems.map((problem) => (
                    <tr
                      key={problem.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2.5">
                        <p className="font-medium">{problem.title}</p>
                        <p className="max-w-[320px] truncate text-xs text-muted-foreground">
                          {problem.slug}
                        </p>
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyClasses[problem.difficulty]}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 tabular-nums">
                        {problem.points}
                      </td>

                      <td className="px-3 py-2.5">
                        <p className="text-xs font-medium">
                          {problem.author?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {problem.author?.email ?? ""}
                        </p>
                      </td>

                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-2.5 text-right">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === problem.id}
                          onClick={() => handleDelete(problem)}
                        >
                          {deletingId === problem.id ? (
                            <Spinner className="size-3.5" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Create a problem</CardTitle>
          <CardDescription>
            Add a new coding challenge to the platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="problem-title">Title</Label>
              <Input
                id="problem-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Two Sum"
                required
                minLength={3}
                maxLength={150}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="problem-description">Description</Label>
              <Textarea
                id="problem-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the problem statement, input, and expected output."
                required
                minLength={10}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="problem-difficulty">Difficulty</Label>
                <select
                  id="problem-difficulty"
                  value={difficulty}
                  onChange={(event) =>
                    setDifficulty(event.target.value as Difficulty)
                  }
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {difficultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem-points">Points</Label>
                <Input
                  id="problem-points"
                  type="number"
                  value={points}
                  onChange={(event) => setPoints(event.target.value)}
                  min={1}
                  max={10000}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <Spinner className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {isCreating ? "Creating..." : "Create problem"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
