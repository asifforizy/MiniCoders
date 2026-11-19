import { Difficulty, Role } from "./generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

type TLanguage = "python" | "javascript" | "cpp" | "java";

type TSeedTestCase = {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  explanation?: string;
};

type TSeedProblem = {
  number: number;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  hints: string[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
  starterCode: Record<TLanguage, string>;
  testCases: TSeedTestCase[];
};

const supportedLanguages: TLanguage[] = [
  "python",
  "javascript",
  "cpp",
  "java",
];

const starter = (
  python: string,
  javascript: string,
  cpp: string,
  java: string
): Record<TLanguage, string> => ({ python, javascript, cpp, java });

const problems: TSeedProblem[] = [
  {
    number: 1,
    title: "Print Hello World",
    slug: "print-hello-world",
    description:
      "Write a program that prints the greeting below exactly as shown. This problem has no input.",
    difficulty: Difficulty.EASY,
    topic: "Basics",
    inputFormat: "No input.",
    outputFormat: "Print Hello, World!",
    constraints: "No input is provided.",
    hints: [
      "Use a print statement.",
      "The comma and exclamation mark are part of the output.",
    ],
    points: 10,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    # TODO: print the greeting
    pass

solve()`,
      `function solve() {
  // TODO: print the greeting
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    // TODO: print the greeting
    return 0;
}`,
      `public class Main {
    public static void main(String[] args) {
        // TODO: print the greeting
    }
}`
    ),
    testCases: [
      {
        input: "",
        expectedOutput: "Hello, World!",
        isPublic: true,
        explanation: "There is no input, only the required greeting.",
      },
      {
        input: "",
        expectedOutput: "Hello, World!",
        isPublic: false,
      },
      {
        input: "",
        expectedOutput: "Hello, World!",
        isPublic: false,
      },
    ],
  },
  {
    number: 2,
    title: "Sum of Two Numbers",
    slug: "sum-of-two-numbers",
    description:
      "Read two integers and print their sum.",
    difficulty: Difficulty.EASY,
    topic: "Math",
    inputFormat: "A single line with two integers a and b separated by a space.",
    outputFormat: "Print a single integer: a + b.",
    constraints: "-1,000,000 <= a, b <= 1,000,000",
    hints: ["Read both integers before calculating.", "Use integer arithmetic."],
    points: 10,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    a, b = map(int, input().split())
    # TODO: print a + b
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const [a, b] = input.split(/\\s+/).map(Number);

function solve() {
  // TODO: print a + b
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    // TODO: print a + b
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        // TODO: print a + b
    }
}`
    ),
    testCases: [
      { input: "2 3\n", expectedOutput: "5", isPublic: true },
      { input: "-10 4\n", expectedOutput: "-6", isPublic: true },
      { input: "1000000 2000000\n", expectedOutput: "3000000", isPublic: false },
      { input: "0 0\n", expectedOutput: "0", isPublic: false },
    ],
  },
  {
    number: 3,
    title: "Subtract Two Numbers",
    slug: "subtract-two-numbers",
    description:
      "Read two integers and print the result of subtracting the second from the first.",
    difficulty: Difficulty.EASY,
    topic: "Math",
    inputFormat: "A single line with two integers a and b separated by a space.",
    outputFormat: "Print a single integer: a - b.",
    constraints: "-1,000,000 <= a, b <= 1,000,000",
    hints: ["The order of the numbers matters.", "The answer can be negative."],
    points: 10,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    a, b = map(int, input().split())
    # TODO: print a - b
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const [a, b] = input.split(/\\s+/).map(Number);

function solve() {
  // TODO: print a - b
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    // TODO: print a - b
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        // TODO: print a - b
    }
}`
    ),
    testCases: [
      { input: "5 2\n", expectedOutput: "3", isPublic: true },
      { input: "2 5\n", expectedOutput: "-3", isPublic: true },
      { input: "100 40\n", expectedOutput: "60", isPublic: false },
      { input: "-5 -3\n", expectedOutput: "-2", isPublic: false },
    ],
  },
  {
    number: 4,
    title: "Check Even or Odd",
    slug: "check-even-or-odd",
    description:
      "Read one integer and print Even if it is divisible by 2, otherwise print Odd.",
    difficulty: Difficulty.EASY,
    topic: "Conditionals",
    inputFormat: "A single line with one integer n.",
    outputFormat: "Print Even or Odd.",
    constraints: "-1,000,000,000 <= n <= 1,000,000,000",
    hints: [
      "Use the remainder operator.",
      "Zero is an even number.",
    ],
    points: 10,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    n = int(input())
    # TODO: print Even or Odd
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const n = Number(input);

function solve() {
  // TODO: print Even or Odd
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    // TODO: print Even or Odd
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // TODO: print Even or Odd
    }
}`
    ),
    testCases: [
      { input: "4\n", expectedOutput: "Even", isPublic: true },
      { input: "7\n", expectedOutput: "Odd", isPublic: true },
      { input: "0\n", expectedOutput: "Even", isPublic: false },
      { input: "-3\n", expectedOutput: "Odd", isPublic: false },
    ],
  },
  {
    number: 5,
    title: "Find the Largest Number",
    slug: "find-the-largest-number",
    description:
      "Read a list of integers and print the largest value. The first line contains the count n, and the second line contains n integers.",
    difficulty: Difficulty.EASY,
    topic: "Arrays",
    inputFormat:
      "The first line contains an integer n. The second line contains n integers separated by spaces.",
    outputFormat: "Print the largest integer in the list.",
    constraints: "1 <= n <= 1000; -1,000,000 <= each number <= 1,000,000",
    hints: [
      "Start with the first number as the current maximum.",
      "Compare each remaining number with the current maximum.",
    ],
    points: 15,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    n = int(input())
    numbers = list(map(int, input().split()))
    # TODO: print the largest number
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const lines = input.split(/\\r?\\n/);
const n = Number(lines[0]);
const numbers = lines[1].split(/\\s+/).map(Number).slice(0, n);

function solve() {
  // TODO: print the largest number
}

solve();`,
      `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];
    // TODO: print the largest number
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] numbers = new long[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextLong();
        // TODO: print the largest number
    }
}`
    ),
    testCases: [
      { input: "5\n3 9 2 7 1\n", expectedOutput: "9", isPublic: true },
      { input: "3\n-5 -2 -9\n", expectedOutput: "-2", isPublic: true },
      { input: "4\n10 10 2 1\n", expectedOutput: "10", isPublic: false },
      { input: "1\n42\n", expectedOutput: "42", isPublic: false },
    ],
  },
  {
    number: 6,
    title: "Find the Largest of Three Numbers",
    slug: "find-largest-of-three-numbers",
    description:
      "Read three integers and print the largest of them.",
    difficulty: Difficulty.EASY,
    topic: "Conditionals",
    inputFormat: "A single line with three integers a, b, and c separated by spaces.",
    outputFormat: "Print the largest integer.",
    constraints: "-1,000,000 <= a, b, c <= 1,000,000",
    hints: [
      "Compare the numbers in pairs.",
      "All three numbers can be equal.",
    ],
    points: 15,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    a, b, c = map(int, input().split())
    # TODO: print the largest number
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const [a, b, c] = input.split(/\\s+/).map(Number);

function solve() {
  // TODO: print the largest number
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    long long a, b, c;
    cin >> a >> b >> c;
    // TODO: print the largest number
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        long c = sc.nextLong();
        // TODO: print the largest number
    }
}`
    ),
    testCases: [
      { input: "1 2 3\n", expectedOutput: "3", isPublic: true },
      { input: "9 4 9\n", expectedOutput: "9", isPublic: true },
      { input: "-1 -5 -3\n", expectedOutput: "-1", isPublic: false },
      { input: "100 50 75\n", expectedOutput: "100", isPublic: false },
    ],
  },
  {
    number: 7,
    title: "Calculate Rectangle Area",
    slug: "calculate-rectangle-area",
    description:
      "Read the width and height of a rectangle and print its area.",
    difficulty: Difficulty.EASY,
    topic: "Math",
    inputFormat:
      "A single line with two integers width and height separated by a space.",
    outputFormat: "Print a single integer: width * height.",
    constraints: "1 <= width, height <= 100,000",
    hints: ["The area of a rectangle is width times height."],
    points: 10,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    width, height = map(int, input().split())
    # TODO: print the area
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const [width, height] = input.split(/\\s+/).map(Number);

function solve() {
  // TODO: print the area
}

solve();`,
      `#include <iostream>
using namespace std;

int main() {
    long long width, height;
    cin >> width >> height;
    // TODO: print the area
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long width = sc.nextLong();
        long height = sc.nextLong();
        // TODO: print the area
    }
}`
    ),
    testCases: [
      { input: "5 3\n", expectedOutput: "15", isPublic: true },
      { input: "10 10\n", expectedOutput: "100", isPublic: true },
      { input: "7 4\n", expectedOutput: "28", isPublic: false },
      { input: "1 1\n", expectedOutput: "1", isPublic: false },
    ],
  },
  {
    number: 8,
    title: "Reverse a String",
    slug: "reverse-a-string-beginner",
    description:
      "Read one line of text and print the characters in reverse order. Spaces are part of the string.",
    difficulty: Difficulty.EASY,
    topic: "Strings",
    inputFormat: "A single line of text.",
    outputFormat: "Print the same text reversed.",
    constraints: "1 <= length of the line <= 1000",
    hints: [
      "Read the entire line, not just the first word.",
      "You can build the answer from the last character to the first.",
    ],
    points: 15,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    text = input()
    # TODO: print the reversed text
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").replace(/\\r?\\n$/, "");

function solve() {
  // TODO: print the reversed text
}

solve();`,
      `#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    getline(cin, text);
    // TODO: print the reversed text
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String text = sc.nextLine();
        // TODO: print the reversed text
    }
}`
    ),
    testCases: [
      { input: "hello\n", expectedOutput: "olleh", isPublic: true },
      { input: "MiniCoders\n", expectedOutput: "sredoCliniM", isPublic: true },
      { input: "abc 123\n", expectedOutput: "321 cba", isPublic: false },
      { input: "a\n", expectedOutput: "a", isPublic: false },
    ],
  },
  {
    number: 9,
    title: "Count Vowels",
    slug: "count-vowels",
    description:
      "Read one line of text and count how many vowels it contains. Count both uppercase and lowercase vowels (a, e, i, o, u).",
    difficulty: Difficulty.EASY,
    topic: "Strings",
    inputFormat: "A single line of text.",
    outputFormat: "Print the number of vowels.",
    constraints: "1 <= length of the line <= 1000",
    hints: [
      "Check each character against the five vowels.",
      "Convert the text to lowercase to simplify the comparison.",
    ],
    points: 15,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    text = input()
    # TODO: count the vowels and print the count
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").replace(/\\r?\\n$/, "");

function solve() {
  // TODO: count the vowels and print the count
}

solve();`,
      `#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    getline(cin, text);
    // TODO: count the vowels and print the count
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String text = sc.nextLine();
        // TODO: count the vowels and print the count
    }
}`
    ),
    testCases: [
      { input: "hello\n", expectedOutput: "2", isPublic: true },
      { input: "MiniCoders\n", expectedOutput: "4", isPublic: true },
      { input: "AEIOU\n", expectedOutput: "5", isPublic: false },
      { input: "xyz\n", expectedOutput: "0", isPublic: false },
    ],
  },
  {
    number: 10,
    title: "Sum of Array Elements",
    slug: "sum-of-array-elements",
    description:
      "Read a list of integers and print their sum. The first line contains the count n, and the second line contains n integers.",
    difficulty: Difficulty.EASY,
    topic: "Arrays",
    inputFormat:
      "The first line contains an integer n. The second line contains n integers separated by spaces.",
    outputFormat: "Print a single integer: the sum of all numbers.",
    constraints: "1 <= n <= 1000; -1,000,000 <= each number <= 1,000,000",
    hints: [
      "Start a running total at zero.",
      "Add each number to the total before printing it.",
    ],
    points: 15,
    timeLimit: 2,
    memoryLimit: 128000,
    starterCode: starter(
      `def solve():
    n = int(input())
    numbers = list(map(int, input().split()))
    # TODO: print the sum of the numbers
    pass

solve()`,
      `const input = require("fs").readFileSync(0, "utf8").trim();
const lines = input.split(/\\r?\\n/);
const n = Number(lines[0]);
const numbers = lines[1].split(/\\s+/).map(Number).slice(0, n);

function solve() {
  // TODO: print the sum of the numbers
}

solve();`,
      `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> numbers(n);
    for (int i = 0; i < n; i++) cin >> numbers[i];
    // TODO: print the sum of the numbers
    return 0;
}`,
      `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long[] numbers = new long[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextLong();
        // TODO: print the sum of the numbers
    }
}`
    ),
    testCases: [
      { input: "5\n1 2 3 4 5\n", expectedOutput: "15", isPublic: true },
      { input: "3\n-1 0 1\n", expectedOutput: "0", isPublic: true },
      { input: "4\n10 20 30 40\n", expectedOutput: "100", isPublic: false },
      { input: "1\n7\n", expectedOutput: "7", isPublic: false },
    ],
  },
];

const getSeedAuthor = async () => {
  const admin = await prisma.user.findFirst({
    where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] }, isDeleted: false },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (admin) return admin;

  return prisma.user.upsert({
    where: { email: "seed-admin@minicoders.local" },
    update: { role: Role.ADMIN, isDeleted: false },
    create: {
      name: "MiniCoders Team",
      email: "seed-admin@minicoders.local",
      role: Role.ADMIN,
      emailVerified: true,
    },
    select: { id: true },
  });
};

const main = async () => {
  const author = await getSeedAuthor();

  for (const problem of problems) {
    const { testCases, ...fields } = problem;

    await prisma.problem.upsert({
      where: { slug: fields.slug },
      update: {
        ...fields,
        supportedLanguages,
        isPublished: true,
        testCases: {
          deleteMany: {},
          create: testCases.map((testCase, index) => ({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            isPublic: testCase.isPublic,
            explanation: testCase.explanation,
            order: index,
          })),
        },
      },
      create: {
        ...fields,
        authorId: author.id,
        supportedLanguages,
        isPublished: true,
        testCases: {
          create: testCases.map((testCase, index) => ({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            isPublic: testCase.isPublic,
            explanation: testCase.explanation,
            order: index,
          })),
        },
      },
    });

    console.log(`Seeded problem #${problem.number}: ${problem.title}`);
  }

  console.log(`Seed complete. ${problems.length} problems are ready.`);
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
