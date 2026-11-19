"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Code2,
  FlaskConical,
  History,
  Loader2,
  Play,
  RotateCcw,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getMySubmissions,
  runCode,
  runCustomInput,
  submitSolution,
} from "@/services/submissionsApi";
import type {
  CustomRunResult,
  Language,
  ProblemDetail,
  RunResult,
  SubmissionStatus,
  SubmissionSummary,
  SubmitResult,
  TestCaseResult,
} from "@/utils/types";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-zinc-400">
        <Loader2 className="size-4 animate-spin" />
        Loading editor...
      </div>
    ),
  }
);

const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java",
};

const MONACO_LANGUAGE: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  cpp: "cpp",
  java: "java",
};

const DEFAULT_STARTER: Record<Language, string> = {
  python: `# Write your solution here\n`,
  javascript: `// Write your solution here\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
  java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n`,
};

const MAX_CODE_LENGTH = 100_000;
const MAX_CUSTOM_INPUT_LENGTH = 10_000;

const verdictStyles: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  ACCEPTED: {
    label: "Accepted",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
  WRONG_ANSWER: {
    label: "Wrong Answer",
    className:
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
  },
  COMPILATION_ERROR: {
    label: "Compilation Error",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  RUNTIME_ERROR: {
    label: "Runtime Error",
    className:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30",
  },
  TIME_LIMIT_EXCEEDED: {
    label: "Time Limit Exceeded",
    className:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  },
  MEMORY_LIMIT_EXCEEDED: {
    label: "Memory Limit Exceeded",
    className:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
  },
  INTERNAL_ERROR: {
    label: "Internal Error",
    className:
      "bg-muted text-muted-foreground border-border",
  },
  PENDING: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
  },
  QUEUED: {
    label: "Queued",
    className: "bg-muted text-muted-foreground border-border",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function VerdictBadge({ status }: { status: SubmissionStatus }) {
  const config = verdictStyles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function formatMetric(value: number | null, unit: "s" | "KB") {
  if (value === null) return "-";

  if (unit === "s") {
    return `${value.toFixed(3)} s`;
  }

  return `${(value / 1024).toFixed(1)} MB`;
}

function TestResultCard({ result }: { result: TestCaseResult }) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        result.passed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {result.passed ? (
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="size-4 text-red-600 dark:text-red-400" />
          )}
          Test case {result.order + 1}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <VerdictBadge status={result.status} />
          <span>{formatMetric(result.time, "s")}</span>
          <span>{formatMetric(result.memory, "KB")}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <p className="mb-1 font-medium text-muted-foreground">Input</p>
          <pre className="max-h-32 overflow-auto rounded-md bg-background p-2 font-mono text-foreground">
            {result.input || "(empty)"}
          </pre>
        </div>
        <div>
          <p className="mb-1 font-medium text-muted-foreground">Expected</p>
          <pre className="max-h-32 overflow-auto rounded-md bg-background p-2 font-mono text-foreground">
            {result.expectedOutput || "(empty)"}
          </pre>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-1 font-medium text-muted-foreground">
            Your output
          </p>
          <pre className="max-h-32 overflow-auto rounded-md bg-background p-2 font-mono text-foreground">
            {result.actualOutput || "(empty)"}
          </pre>
        </div>
        {result.compileOutput ? (
          <div className="sm:col-span-2">
            <p className="mb-1 font-medium text-muted-foreground">
              Compiler output
            </p>
            <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 font-mono text-amber-700 dark:text-amber-400">
              {result.compileOutput}
            </pre>
          </div>
        ) : null}
        {result.stderr ? (
          <div className="sm:col-span-2">
            <p className="mb-1 font-medium text-muted-foreground">Error</p>
            <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 font-mono text-red-700 dark:text-red-400">
              {result.stderr}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type OutputTab = "results" | "custom" | "submissions";

export function CodeWorkspace({ problem }: { problem: ProblemDetail }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const availableLanguages = useMemo<Language[]>(() => {
    const supported = problem.supportedLanguages.filter(
      (language): language is Language =>
        ["python", "javascript", "cpp", "java"].includes(language)
    );

    return supported.length > 0
      ? supported
      : (["python", "javascript", "cpp", "java"] as Language[]);
  }, [problem.supportedLanguages]);

  const starterFor = (language: Language) =>
    problem.starterCode?.[language] || DEFAULT_STARTER[language];

  const [language, setLanguage] = useState<Language>(
    availableLanguages[0] ?? "python"
  );
  const [code, setCode] = useState<string>(() =>
    starterFor(availableLanguages[0] ?? "python")
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomRunning, setIsCustomRunning] = useState(false);
  const [solved, setSolved] = useState(problem.isSolved);

  const [activeTab, setActiveTab] = useState<OutputTab>("results");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const [customInput, setCustomInput] = useState("");
  const [customResult, setCustomResult] = useState<CustomRunResult | null>(
    null
  );
  const [customError, setCustomError] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<SubmissionSummary[] | null>(
    null
  );
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    setSubmissionsError(null);

    try {
      const data = await getMySubmissions(problem.id);
      setSubmissions(data.submissions);
    } catch (error) {
      setSubmissionsError(
        error instanceof Error ? error.message : "Failed to load submissions"
      );
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const openSubmissionsTab = () => {
    setActiveTab("submissions");

    if (submissions === null && !isLoadingSubmissions) {
      void loadSubmissions();
    }
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setCode(starterFor(nextLanguage));
    setRunResult(null);
    setSubmitResult(null);
    setRunError(null);
    setCustomResult(null);
    setCustomError(null);
  };

  const handleReset = () => {
    setCode(starterFor(language));
    setRunResult(null);
    setSubmitResult(null);
    setRunError(null);
    setCustomResult(null);
    setCustomError(null);
    toast.success("Editor reset to the starter code");
  };

  const validateBeforeExecution = () => {
    if (!code.trim()) {
      toast.error("Please write some code first.");
      return false;
    }

    if (code.length > MAX_CODE_LENGTH) {
      toast.error(
        `Source code must be at most ${MAX_CODE_LENGTH.toLocaleString()} characters.`
      );
      return false;
    }

    return true;
  };

  const handleRun = async () => {
    if (isRunning || isSubmitting) return;
    if (!validateBeforeExecution()) return;

    setIsRunning(true);
    setActiveTab("results");
    setRunError(null);
    setSubmitResult(null);

    try {
      const result = await runCode({
        problemId: problem.id,
        language,
        code,
      });

      setRunResult(result);

      if (result.verdict === "ACCEPTED") {
        toast.success(`All ${result.total} public test cases passed`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run code";
      setRunError(message);
      toast.error(message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isRunning || isSubmitting) return;
    if (!validateBeforeExecution()) return;

    setIsSubmitting(true);
    setActiveTab("results");
    setRunError(null);
    setRunResult(null);

    try {
      const result = await submitSolution({
        problemId: problem.id,
        language,
        code,
      });

      setSubmitResult(result);
      setSubmissions(null);

      if (result.verdict === "ACCEPTED") {
        setSolved(true);
        toast.success("Accepted! Your solution passed every test case.");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit code";
      setRunError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomRun = async () => {
    if (isCustomRunning || isRunning || isSubmitting) return;
    if (!validateBeforeExecution()) return;

    if (customInput.length > MAX_CUSTOM_INPUT_LENGTH) {
      toast.error(
        `Custom input must be at most ${MAX_CUSTOM_INPUT_LENGTH.toLocaleString()} characters.`
      );
      return;
    }

    setIsCustomRunning(true);
    setCustomError(null);

    try {
      const result = await runCustomInput({
        problemId: problem.id,
        language,
        code,
        customInput,
      });

      setCustomResult(result);

      if (result.status === "ACCEPTED") {
        toast.success("Code executed successfully");
      } else {
        toast.error(result.statusDescription || result.status);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run code";
      setCustomError(message);
      toast.error(message);
    } finally {
      setIsCustomRunning(false);
    }
  };

  const currentResult = submitResult ?? runResult;

  return (
    <section className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 className="size-4 text-primary" />
          Code Workspace
          {solved ? (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              Solved
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={language}
            onChange={(event) =>
              handleLanguageChange(event.target.value as Language)
            }
            aria-label="Select programming language"
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {availableLanguages.map((option) => (
              <option key={option} value={option}>
                {LANGUAGE_LABELS[option]}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isRunning || isSubmitting || isCustomRunning}
          >
            <RotateCcw />
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting || isCustomRunning}
          >
            {isRunning ? <Loader2 className="animate-spin" /> : <Play />}
            {isRunning ? "Running..." : "Run"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting || isCustomRunning}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
            {isSubmitting ? "Judging..." : "Submit"}
          </Button>
        </div>
      </div>

      <div className="flex min-h-[360px] flex-1 flex-col bg-zinc-950 lg:min-h-[460px]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
          <span className="size-2 rounded-full bg-red-500" />
          <span className="size-2 rounded-full bg-yellow-500" />
          <span className="size-2 rounded-full bg-green-500" />
          <span className="ml-2 font-mono">
            solution.
            {language === "python"
              ? "py"
              : language === "javascript"
                ? "js"
                : language === "cpp"
                  ? "cpp"
                  : "java"}
          </span>
        </div>

        <div className="h-[360px] w-full lg:h-[420px]">
          <MonacoEditor
            height="100%"
            language={MONACO_LANGUAGE[language]}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            loading={
              <div className="flex h-full items-center justify-center gap-2 text-sm text-zinc-400">
                <Loader2 className="size-4 animate-spin" />
                Loading editor...
              </div>
            }
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "line",
              smoothScrolling: true,
            }}
          />
        </div>
      </div>

      <div className="border-t border-border bg-muted/20">
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              activeTab === "results"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="size-3.5" />
            Test Results
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              activeTab === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FlaskConical className="size-3.5" />
            Custom Input
          </button>

          <button
            type="button"
            onClick={openSubmissionsTab}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
              activeTab === "submissions"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="size-3.5" />
            Submissions
          </button>

          {currentResult ? (
            <div className="ml-auto flex items-center gap-2">
              <VerdictBadge status={currentResult.verdict} />
              <span className="text-xs text-muted-foreground">
                {currentResult.passed}/{currentResult.total} passed
              </span>
            </div>
          ) : null}
        </div>

        <div className="max-h-[340px] min-h-24 overflow-auto p-3">
          {activeTab === "results" ? (
            <div className="space-y-3">
              {runError ? (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p>{runError}</p>
                    {runError.toLowerCase().includes("log in") ? (
                      <a
                        href="/login"
                        className="mt-1 inline-block font-medium underline"
                      >
                        Go to login
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {!runError && !currentResult ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <Terminal className="size-7 text-muted-foreground" />
                  <p className="text-sm font-medium">No results yet</p>
                  <p className="max-w-md text-xs text-muted-foreground">
                    Run your code against the public examples, or submit it to
                    be judged against every test case including hidden ones.
                  </p>
                </div>
              ) : null}

              {currentResult ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {currentResult.message}
                    </span>
                    <span>Time: {formatMetric(currentResult.time, "s")}</span>
                    <span>
                      Memory: {formatMetric(currentResult.memory, "KB")}
                    </span>
                  </div>

                  {currentResult.results.length === 0 ? (
                    <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                      The judge could not return public test details for this
                      submission.
                    </p>
                  ) : (
                    currentResult.results.map((result) => (
                      <TestResultCard
                        key={`${result.order}-${result.status}`}
                        result={result}
                      />
                    ))
                  )}
                </>
              ) : null}
            </div>
          ) : null}

          {activeTab === "custom" ? (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="custom-input"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Standard input (stdin)
                </label>
                <Textarea
                  id="custom-input"
                  value={customInput}
                  onChange={(event) => setCustomInput(event.target.value)}
                  placeholder="Type the input your program should read..."
                  rows={5}
                  spellCheck={false}
                  maxLength={MAX_CUSTOM_INPUT_LENGTH}
                  className="min-h-24 font-mono text-xs"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {customInput.length}/{MAX_CUSTOM_INPUT_LENGTH} characters
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCustomRun}
                    disabled={
                      isCustomRunning || isRunning || isSubmitting
                    }
                  >
                    {isCustomRunning ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Play />
                    )}
                    {isCustomRunning ? "Running..." : "Run with custom input"}
                  </Button>
                </div>
              </div>

              {customError ? (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{customError}</p>
                </div>
              ) : null}

              {customResult ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                    <VerdictBadge status={customResult.status} />
                    <span>Time: {formatMetric(customResult.time, "s")}</span>
                    <span>
                      Memory: {formatMetric(customResult.memory, "KB")}
                    </span>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Output
                    </p>
                    <pre className="max-h-40 overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs">
                      {customResult.output || "(no output)"}
                    </pre>
                  </div>

                  {customResult.compileOutput ? (
                    <div>
                      <p className="mb-1 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="size-3.5" />
                        Compiler output
                      </p>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 font-mono text-xs text-amber-700 dark:text-amber-400">
                        {customResult.compileOutput}
                      </pre>
                    </div>
                  ) : null}

                  {customResult.stderr ? (
                    <div>
                      <p className="mb-1 text-xs font-medium text-red-700 dark:text-red-400">
                        Error
                      </p>
                      <pre className="max-h-40 overflow-auto rounded-lg border border-red-500/30 bg-red-500/5 p-3 font-mono text-xs text-red-700 dark:text-red-400">
                        {customResult.stderr}
                      </pre>
                    </div>
                  ) : null}
                </div>
              ) : !customError ? (
                <p className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                  Custom input runs are not saved and do not affect your solved
                  status.
                </p>
              ) : null}
            </div>
          ) : null}

          {activeTab === "submissions" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Your private submission history for this problem.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => void loadSubmissions()}
                  disabled={isLoadingSubmissions}
                >
                  {isLoadingSubmissions ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <RotateCcw />
                  )}
                  Refresh
                </Button>
              </div>

              {submissionsError ? (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{submissionsError}</p>
                </div>
              ) : null}

              {isLoadingSubmissions && submissions === null ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-12 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : null}

              {!isLoadingSubmissions && submissions?.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1 py-8 text-center">
                  <History className="size-7 text-muted-foreground" />
                  <p className="text-sm font-medium">No submissions yet</p>
                  <p className="text-xs text-muted-foreground">
                    Submit a solution to see it here.
                  </p>
                </div>
              ) : null}

              {submissions?.map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <VerdictBadge status={submission.status} />
                    <span className="text-xs font-medium">
                      {LANGUAGE_LABELS[
                        submission.language as Language
                      ] ?? submission.language}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {submission.passedTestCases}/{submission.totalTestCases}{" "}
                      tests
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatMetric(submission.time, "s")}</span>
                    <span>{formatMetric(submission.memory, "KB")}</span>
                    <span>
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
