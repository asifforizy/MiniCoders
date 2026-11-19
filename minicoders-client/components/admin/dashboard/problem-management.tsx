"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
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
import {
  createProblem,
  deleteProblem,
  getAdminProblem,
  updateProblem,
} from "@/services/adminApi";
import type {
  AdminProblem,
  AdminTestCasePayload,
  CreateProblemPayload,
  Difficulty,
  Language,
} from "@/utils/types";

type ProblemManagementProps = {
  problems: AdminProblem[];
};

type FormTestCase = {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
};

type ProblemFormState = {
  title: string;
  description: string;
  difficulty: Difficulty;
  points: string;
  number: string;
  topic: string;
  timeLimit: string;
  memoryLimit: string;
  isPublished: boolean;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  hints: string;
  starterCode: Record<Language, string>;
  testCases: FormTestCase[];
};

const difficultyClasses: Record<Difficulty, string> = {
  EASY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HARD: "bg-red-500/10 text-red-600 dark:text-red-400",
  EXPERT: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const difficultyOptions: Difficulty[] = ["EASY", "MEDIUM", "HARD", "EXPERT"];
const languages: Language[] = ["python", "javascript", "cpp", "java"];

const languageLabels: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java",
};

const emptyTestCase = (isPublic = false): FormTestCase => ({
  input: "",
  expectedOutput: "",
  isPublic,
});

const emptyForm = (): ProblemFormState => ({
  title: "",
  description: "",
  difficulty: "EASY",
  points: "100",
  number: "",
  topic: "",
  timeLimit: "2",
  memoryLimit: "128000",
  isPublished: true,
  inputFormat: "",
  outputFormat: "",
  constraints: "",
  hints: "",
  starterCode: {
    python: "",
    javascript: "",
    cpp: "",
    java: "",
  },
  testCases: [emptyTestCase(true)],
});

const optionalNumber = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const optionalText = (value: string): string | undefined =>
  value.trim() ? value.trim() : undefined;

export function ProblemManagement({ problems }: ProblemManagementProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProblemFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const setField = <K extends keyof ProblemFormState>(
    key: K,
    value: ProblemFormState[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateTestCase = (
    index: number,
    patch: Partial<FormTestCase>
  ) => {
    setForm((current) => ({
      ...current,
      testCases: current.testCases.map((testCase, testIndex) =>
        testIndex === index ? { ...testCase, ...patch } : testCase
      ),
    }));
  };

  const addTestCase = (isPublic: boolean) => {
    setForm((current) => ({
      ...current,
      testCases: [...current.testCases, emptyTestCase(isPublic)],
    }));
  };

  const removeTestCase = (index: number) => {
    setForm((current) => ({
      ...current,
      testCases: current.testCases.filter(
        (_, testIndex) => testIndex !== index
      ),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const buildPayload = (): CreateProblemPayload | null => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return null;
    }

    const testCases: AdminTestCasePayload[] = form.testCases
      .filter((testCase) => testCase.expectedOutput.trim())
      .map((testCase, index) => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        isPublic: testCase.isPublic,
        order: index,
      }));

    if (testCases.length === 0) {
      toast.error("Add at least one test case with an expected output");
      return null;
    }

    if (form.isPublished && !testCases.some((testCase) => testCase.isPublic)) {
      toast.error("A published problem needs at least one public test case");
      return null;
    }

    const starterCode = Object.fromEntries(
      languages
        .map((language) => [language, form.starterCode[language].trim()])
        .filter(([, value]) => Boolean(value))
    ) as Partial<Record<Language, string>>;

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      points: optionalNumber(form.points),
      number: optionalNumber(form.number),
      topic: optionalText(form.topic),
      inputFormat: optionalText(form.inputFormat),
      outputFormat: optionalText(form.outputFormat),
      constraints: optionalText(form.constraints),
      hints: form.hints
        .split("\n")
        .map((hint) => hint.trim())
        .filter(Boolean),
      starterCode:
        Object.keys(starterCode).length > 0 ? starterCode : undefined,
      supportedLanguages: languages,
      timeLimit: optionalNumber(form.timeLimit),
      memoryLimit: optionalNumber(form.memoryLimit),
      isPublished: form.isPublished,
      testCases,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = buildPayload();
    if (!payload) return;

    setIsSaving(true);

    const result = editingId
      ? await updateProblem(editingId, payload)
      : await createProblem(payload);

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      editingId ? "Problem updated successfully" : "Problem created successfully"
    );
    resetForm();
    router.refresh();
  };

  const handleEdit = async (problem: AdminProblem) => {
    setLoadingEditId(problem.id);

    try {
      const detail = await getAdminProblem(problem.id);

      setEditingId(problem.id);
      setForm({
        title: detail.title,
        description: detail.description,
        difficulty: detail.difficulty,
        points: String(detail.points),
        number: detail.number ? String(detail.number) : "",
        topic: detail.topic ?? "",
        timeLimit: String(detail.timeLimit),
        memoryLimit: String(detail.memoryLimit),
        isPublished: detail.isPublished,
        inputFormat: detail.inputFormat ?? "",
        outputFormat: detail.outputFormat ?? "",
        constraints: detail.constraints ?? "",
        hints: detail.hints.join("\n"),
        starterCode: {
          python: detail.starterCode?.python ?? "",
          javascript: detail.starterCode?.javascript ?? "",
          cpp: detail.starterCode?.cpp ?? "",
          java: detail.starterCode?.java ?? "",
        },
        testCases:
          detail.testCases.length > 0
            ? detail.testCases.map((testCase) => ({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                isPublic: testCase.isPublic,
              }))
            : [emptyTestCase(true)],
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load problem"
      );
    } finally {
      setLoadingEditId(null);
    }
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
    if (editingId === problem.id) resetForm();
    router.refresh();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
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
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Problem</th>
                  <th className="px-3 py-2.5 font-medium">Topic</th>
                  <th className="px-3 py-2.5 font-medium">Difficulty</th>
                  <th className="px-3 py-2.5 font-medium">Tests</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium">Author</th>
                  <th className="px-3 py-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
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
                        <p className="font-medium">
                          {problem.number ? `#${problem.number} ` : ""}
                          {problem.title}
                        </p>
                        <p className="max-w-[280px] truncate text-xs text-muted-foreground">
                          {problem.slug}
                        </p>
                      </td>

                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {problem.topic ?? "-"}
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyClasses[problem.difficulty]}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-xs tabular-nums">
                        {problem._count?.testCases ?? 0}
                      </td>

                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            problem.isPublished
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {problem.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="px-3 py-2.5">
                        <p className="text-xs font-medium">
                          {problem.author?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {problem.author?.email ?? ""}
                        </p>
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={loadingEditId === problem.id}
                            onClick={() => handleEdit(problem)}
                          >
                            {loadingEditId === problem.id ? (
                              <Spinner className="size-3.5" />
                            ) : (
                              <Pencil className="size-3.5" />
                            )}
                            Edit
                          </Button>
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
                        </div>
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
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>
                {editingId ? "Edit problem" : "Create a problem"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "Update the statement, limits, starter code, and test cases."
                  : "Add a new coding challenge with starter code and test cases."}
              </CardDescription>
            </div>
            {editingId ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={resetForm}
                aria-label="Cancel editing"
              >
                <X />
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="problem-title">Title</Label>
              <Input
                id="problem-title"
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
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
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Describe the problem statement."
                required
                minLength={10}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="problem-number">Problem number</Label>
                <Input
                  id="problem-number"
                  type="number"
                  min={1}
                  value={form.number}
                  onChange={(event) => setField("number", event.target.value)}
                  placeholder="1"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem-topic">Topic</Label>
                <Input
                  id="problem-topic"
                  value={form.topic}
                  onChange={(event) => setField("topic", event.target.value)}
                  placeholder="Arrays"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem-difficulty">Difficulty</Label>
                <select
                  id="problem-difficulty"
                  value={form.difficulty}
                  onChange={(event) =>
                    setField("difficulty", event.target.value as Difficulty)
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
                  value={form.points}
                  onChange={(event) => setField("points", event.target.value)}
                  min={1}
                  max={10000}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem-time">Time limit (s)</Label>
                <Input
                  id="problem-time"
                  type="number"
                  step="0.5"
                  min={1}
                  max={15}
                  value={form.timeLimit}
                  onChange={(event) =>
                    setField("timeLimit", event.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="problem-memory">Memory (KB)</Label>
                <Input
                  id="problem-memory"
                  type="number"
                  min={16000}
                  max={512000}
                  value={form.memoryLimit}
                  onChange={(event) =>
                    setField("memoryLimit", event.target.value)
                  }
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  setField("isPublished", event.target.checked)
                }
                className="size-4 accent-primary"
              />
              Publish this problem
            </label>

            <details className="rounded-lg border border-border p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Statement details
              </summary>
              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="problem-input-format">Input format</Label>
                  <Textarea
                    id="problem-input-format"
                    value={form.inputFormat}
                    onChange={(event) =>
                      setField("inputFormat", event.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="problem-output-format">Output format</Label>
                  <Textarea
                    id="problem-output-format"
                    value={form.outputFormat}
                    onChange={(event) =>
                      setField("outputFormat", event.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="problem-constraints">Constraints</Label>
                  <Textarea
                    id="problem-constraints"
                    value={form.constraints}
                    onChange={(event) =>
                      setField("constraints", event.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="problem-hints">
                    Hints (one per line)
                  </Label>
                  <Textarea
                    id="problem-hints"
                    value={form.hints}
                    onChange={(event) => setField("hints", event.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </details>

            <details className="rounded-lg border border-border p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Starter code
              </summary>
              <div className="mt-3 space-y-3">
                {languages.map((language) => (
                  <div key={language} className="space-y-1.5">
                    <Label htmlFor={`starter-${language}`}>
                      {languageLabels[language]}
                    </Label>
                    <Textarea
                      id={`starter-${language}`}
                      value={form.starterCode[language]}
                      onChange={(event) =>
                        setField("starterCode", {
                          ...form.starterCode,
                          [language]: event.target.value,
                        })
                      }
                      rows={3}
                      spellCheck={false}
                      className="font-mono text-xs"
                    />
                  </div>
                ))}
              </div>
            </details>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Test cases</Label>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => addTestCase(true)}
                  >
                    <Plus />
                    Public
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => addTestCase(false)}
                  >
                    <Plus />
                    Hidden
                  </Button>
                </div>
              </div>

              {form.testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border border-border p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={testCase.isPublic}
                        onChange={(event) =>
                          updateTestCase(index, {
                            isPublic: event.target.checked,
                          })
                        }
                        className="size-3.5 accent-primary"
                      />
                      Public
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeTestCase(index)}
                      aria-label={`Remove test case ${index + 1}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <Textarea
                    value={testCase.input}
                    onChange={(event) =>
                      updateTestCase(index, { input: event.target.value })
                    }
                    placeholder="Input (stdin)"
                    rows={2}
                    spellCheck={false}
                    className="font-mono text-xs"
                  />

                  <Textarea
                    value={testCase.expectedOutput}
                    onChange={(event) =>
                      updateTestCase(index, {
                        expectedOutput: event.target.value,
                      })
                    }
                    placeholder="Expected output"
                    rows={2}
                    spellCheck={false}
                    className="font-mono text-xs"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Spinner className="size-4" />
              ) : editingId ? (
                <Pencil className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create problem"}
            </Button>

            {editingId ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetForm}
                disabled={isSaving}
              >
                Cancel editing
              </Button>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
