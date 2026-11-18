"use client";

import { useState } from "react";
import {
  Code2,
  Loader2,
  Play,
  RotateCcw,
  Send,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Language = "javascript" | "python" | "cpp" | "java";

const languageLabels: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
};

const fileExtensions: Record<Language, string> = {
  javascript: "js",
  python: "py",
  cpp: "cpp",
  java: "java",
};

const starterCode: Record<Language, string> = {
  javascript: `function solve(input) {
  // Write your solution here
  return input;
}

console.log(solve(""));`,
  python: `def solve(data):
    # Write your solution here
    return data

print(solve(""))`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
};

export function CodeWorkspace({ problemTitle }: { problemTitle: string }) {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(starterCode.javascript);
  const [output, setOutput] = useState(
    "Run your code to see the demo output here."
  );
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage]);
    setOutput("Run your code to see the demo output here.");
  };

  const handleReset = () => {
    setCode(starterCode[language]);
    setOutput("Editor reset to the starter code.");
  };

  const handleRun = () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("Running code...");

    window.setTimeout(() => {
      setOutput(
        `[demo] ${languageLabels[language]} code received for "${problemTitle}".\n\nCode execution is not connected yet. This output is a placeholder for the future compiler.`
      );
      setIsRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    setOutput(
      `[demo] Submission received for "${problemTitle}".\n\nSubmission and judging are not connected yet. No code was sent to the server.`
    );
    toast.success("Demo submission received");
  };

  return (
    <section className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 className="size-4 text-primary" />
          Code Workspace
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
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw />
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Play />
            )}
            Run
          </Button>

          <Button type="button" size="sm" onClick={handleSubmit}>
            <Send />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
          <span className="size-2 rounded-full bg-red-500" />
          <span className="size-2 rounded-full bg-yellow-500" />
          <span className="size-2 rounded-full bg-green-500" />
          <span className="ml-2 font-mono">
            solution.{fileExtensions[language]}
          </span>
        </div>

        <Textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              handleRun();
            }
          }}
          spellCheck={false}
          aria-label="Code editor"
          className="field-sizing-fixed min-h-[340px] flex-1 resize-none rounded-none border-0 bg-transparent p-4 font-mono text-[13px] leading-6 text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-transparent"
        />
      </div>

      <div className="border-t border-border bg-muted/30">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Terminal className="size-3.5" />
          Output
        </div>
        <pre className="min-h-24 whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-5 text-muted-foreground">
          {output}
        </pre>
      </div>
    </section>
  );
}
