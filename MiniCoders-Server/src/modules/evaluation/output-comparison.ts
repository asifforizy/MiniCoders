/**
 * Normalizes program output for comparison without hiding real mistakes.
 *
 * Handled:
 * - Windows / old-Mac line endings
 * - trailing spaces and tabs on each line
 * - leading spaces and tabs on each line
 * - trailing blank lines
 *
 * Not handled (differences still fail):
 * - internal whitespace changes
 * - letter casing
 * - missing or extra tokens
 */
export const normalizeOutput = (value: string): string =>
  value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^[ \t]+|[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n+$/g, "")
    .trim();

export const outputsMatch = (actual: string, expected: string): boolean =>
  normalizeOutput(actual) === normalizeOutput(expected);
