import { Info, Lightbulb } from "lucide-react";

import type { LessonBlock } from "@/lib/learn/python-lessons";
import { cn } from "@/lib/utils";

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function CodeBlock({
  code,
  caption,
  output,
}: {
  code: string;
  caption?: string;
  output?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-medium text-zinc-400">
          {caption ?? "Python"}
        </span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          python
        </span>
      </div>

      <pre className="overflow-x-auto p-4 text-[13px] leading-6">
        <code className="font-mono">{code}</code>
      </pre>

      {output ? (
        <div className="border-t border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            Output
          </p>
          <pre className="overflow-x-auto font-mono text-[13px] leading-6 text-emerald-300">
            <code>{output}</code>
          </pre>
        </div>
      ) : null}
    </figure>
  );
}

function NoteBlock({
  title,
  text,
  tone = "tip",
}: {
  title: string;
  text: string;
  tone?: "tip" | "warning" | "info";
}) {
  const Icon = tone === "tip" ? Lightbulb : Info;

  return (
    <aside
      className={cn(
        "flex gap-3 rounded-xl border p-4",
        tone === "warning" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        tone === "info" &&
          "border-border bg-muted/40 text-foreground",
        tone === "tip" &&
          "border-primary/20 bg-primary/5 text-foreground"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "warning" ? "text-amber-600 dark:text-amber-400" : "text-primary"
        )}
      />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 opacity-90">{text}</p>
      </div>
    </aside>
  );
}

function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="pt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="text-[15px] leading-7 text-foreground/85">
          <InlineText text={block.text} />
        </p>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";

      return (
        <ListTag
          className={cn(
            "space-y-2 pl-5 text-[15px] leading-7 text-foreground/85",
            block.ordered ? "list-decimal" : "list-disc"
          )}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1 marker:text-primary">
              <InlineText text={item} />
            </li>
          ))}
        </ListTag>
      );
    }

    case "code":
      return (
        <CodeBlock
          code={block.code}
          caption={block.caption}
          output={block.output}
        />
      );

    case "note":
      return (
        <NoteBlock
          title={block.title}
          text={block.text}
          tone={block.tone}
        />
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead className="bg-muted/60">
              <tr>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-border even:bg-muted/20"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 font-mono text-[13px] text-foreground/85"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function LessonBlocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <LessonBlockView key={index} block={block} />
      ))}
    </div>
  );
}
