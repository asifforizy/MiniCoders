import {
  BookOpen,
  Calculator,
  Code,
  Database,
  GitBranch,
  Keyboard,
  Layers,
  List,
  Package,
  RefreshCw,
  Type,
  Variable,
  type LucideIcon,
} from "lucide-react";

export type LessonModule =
  | "Getting started"
  | "Working with data"
  | "Logic and collections";

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; code: string; caption?: string; output?: string }
  | {
      type: "note";
      title: string;
      text: string;
      tone?: "tip" | "warning" | "info";
    }
  | { type: "table"; headers: string[]; rows: string[][] };

export type Lesson = {
  slug: string;
  order: number;
  module: LessonModule;
  title: string;
  summary: string;
  description: string;
  readTime: string;
  icon: LucideIcon;
  objectives: string[];
  blocks: LessonBlock[];
  keyPoints: string[];
  practice: string;
};

export const pythonLessons: Lesson[] = [
  {
    slug: "python-introduction",
    order: 1,
    module: "Getting started",
    title: "What is Python?",
    summary: "Meet Python, the friendly language you will use to build things.",
    description:
      "Python is a popular programming language known for its clear, readable syntax. In this lesson you will learn what Python is, why people love it, and how to write your very first program.",
    readTime: "5 min",
    icon: BookOpen,
    objectives: [
      "Explain what Python is in your own words",
      "Write and understand a simple print statement",
      "Name a few real-world uses of Python",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Python is a high-level, general-purpose programming language. A programming language is simply a way to give instructions to a computer. Python was created by Guido van Rossum and released in 1991. Its biggest goal is to be easy to read, almost like plain English.",
      },
      {
        type: "paragraph",
        text: "A Python program is a list of instructions. Python reads the program from top to bottom and performs each instruction in order. That is why Python is called an interpreted language: it runs the code directly instead of making you compile it first.",
      },
      {
        type: "heading",
        text: "Your first program",
      },
      {
        type: "paragraph",
        text: "The `print()` function shows text on the screen. Text inside quotes is called a string.",
      },
      {
        type: "code",
        caption: "hello.py",
        code: `print("Hello, MiniCoder!")
print("I am learning Python.")`,
        output: `Hello, MiniCoder!
I am learning Python.`,
      },
      {
        type: "paragraph",
        text: "Python runs the first line, then the second line. The quotes are not printed. They only tell Python where the text starts and ends.",
      },
      {
        type: "heading",
        text: "Why people choose Python",
      },
      {
        type: "list",
        items: [
          "Readable syntax that is friendly for beginners",
          "Used in web development, data science, artificial intelligence, automation, and game development",
          "A huge community with free libraries and tutorials",
          "Runs on Windows, macOS, Linux, and even tiny boards like the Raspberry Pi",
        ],
      },
      {
        type: "note",
        title: "A gentle start",
        text: "You do not need to memorize everything. Read the examples, run them, change them, and watch what happens. Small experiments are the fastest way to learn Python.",
        tone: "tip",
      },
    ],
    keyPoints: [
      "Python is a high-level, general-purpose, interpreted language.",
      "Programs run one instruction at a time, from top to bottom.",
      "print() displays values on the screen.",
      "Strings are written inside quotes.",
    ],
    practice:
      "Write a program with two print statements. The first should print your name, and the second should print your favorite hobby.",
  },
  {
    slug: "python-syntax",
    order: 2,
    module: "Getting started",
    title: "Python syntax",
    summary: "Learn the rules that keep your Python code clean and runnable.",
    description:
      "Syntax is the set of rules that describes how code must be written. Python has a small, readable set of rules. Once you know them, your programs become much easier to write and fix.",
    readTime: "6 min",
    icon: Code,
    objectives: [
      "Write statements with correct capitalization and punctuation",
      "Use indentation to group code",
      "Add comments and recognize common syntax mistakes",
    ],
    blocks: [
      {
        type: "heading",
        text: "One statement per line",
      },
      {
        type: "paragraph",
        text: "A statement is a single instruction. In Python, each statement usually sits on its own line. You do not need a semicolon at the end, although you can use one to place two statements on the same line.",
      },
      {
        type: "code",
        caption: "statements.py",
        code: `name = "Mia"
age = 10
print("Hello", name)`,
        output: `Hello Mia`,
      },
      {
        type: "heading",
        text: "Indentation matters",
      },
      {
        type: "paragraph",
        text: "Python uses indentation to show which lines belong together. The standard is four spaces for each level. Lines inside an `if` block, a loop, or a function are indented.",
      },
      {
        type: "code",
        caption: "indentation.py",
        code: `if 10 > 5:
    print("Ten is bigger")
    print("This line is inside the if")`,
        output: `Ten is bigger
This line is inside the if`,
      },
      {
        type: "note",
        title: "Spaces, not tabs",
        text: "Mixing tabs and spaces can cause an IndentationError that is hard to see. Pick four spaces and use them consistently.",
        tone: "warning",
      },
      {
        type: "heading",
        text: "Comments",
      },
      {
        type: "paragraph",
        text: "A comment starts with `#`. Python ignores everything after the hash on that line. Use comments to explain why code exists, not to repeat what the code already says.",
      },
      {
        type: "code",
        caption: "comments.py",
        code: `# Calculate the number of minutes in a day
minutes = 24 * 60
print(minutes)`,
        output: `1440`,
      },
      {
        type: "heading",
        text: "Capitalization and quotes",
      },
      {
        type: "paragraph",
        text: "Python is case-sensitive. `print` and `Print` are different names, and only the first one exists. Quotes must also match: start a string with `\"` and end it with `\"`, or use single quotes on both sides.",
      },
      {
        type: "list",
        items: [
          "`print(\"Hello\")` works.",
          "`Print(\"Hello\")` raises a NameError.",
          "`print(\"Hello')` raises a SyntaxError because the quotes do not match.",
        ],
      },
      {
        type: "note",
        title: "Read errors slowly",
        text: "Python errors point to the line where something went wrong. Read the last line of the error first. It names the problem, such as SyntaxError or IndentationError.",
        tone: "info",
      },
    ],
    keyPoints: [
      "Python is case-sensitive.",
      "Indentation groups code and is part of the syntax.",
      "Use four spaces per indentation level.",
      "Comments start with # and are ignored by Python.",
      "Strings need matching quotes.",
    ],
    practice:
      "Create a file with a comment, one variable assignment, and a print statement. Then break the indentation on purpose and read the error message.",
  },
  {
    slug: "variables",
    order: 3,
    module: "Getting started",
    title: "Variables",
    summary: "Store information in named values and change them whenever you need.",
    description:
      "A variable is a name that refers to a value. Variables let your program remember information such as a player score, a user name, or a total price.",
    readTime: "6 min",
    icon: Variable,
    objectives: [
      "Create variables with the assignment operator",
      "Follow Python naming rules and conventions",
      "Reassign values and use multiple assignment",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Think of a variable as a label attached to a value. The label is the name, and the value is whatever the name currently points to. You create a variable with an equals sign, which means assign, not equals.",
      },
      {
        type: "code",
        caption: "variables.py",
        code: `name = "Leo"
score = 0
score = score + 10

print(name)
print(score)`,
        output: `Leo
10`,
      },
      {
        type: "paragraph",
        text: "`score = 0` creates the name `score` and points it at zero. `score = score + 10` calculates a new value, then points `score` at that new value.",
      },
      {
        type: "heading",
        text: "Naming rules",
      },
      {
        type: "list",
        items: [
          "Names may contain letters, numbers, and underscores.",
          "A name cannot start with a number.",
          "A name cannot contain spaces.",
          "Names are case-sensitive, so `score` and `Score` are different.",
          "A name cannot be a Python keyword such as `if`, `for`, `while`, or `class`.",
        ],
      },
      {
        type: "paragraph",
        text: "Python programmers usually write variable names in `snake_case`: lowercase words separated by underscores. Clear names make code easier to understand. `player_score` is better than `ps`.",
      },
      {
        type: "heading",
        text: "Variables can change type",
      },
      {
        type: "paragraph",
        text: "Python is dynamically typed. A variable does not have a fixed type, so the same name can point to a string and later to a number.",
      },
      {
        type: "code",
        caption: "dynamic.py",
        code: `value = "ten"
print(value)

value = 10
print(value)`,
        output: `ten
10`,
      },
      {
        type: "heading",
        text: "Multiple assignment",
      },
      {
        type: "paragraph",
        text: "You can assign several values in one line. You can also swap two variables without a temporary variable.",
      },
      {
        type: "code",
        caption: "swap.py",
        code: `x, y = 3, 7
print(x, y)

x, y = y, x
print(x, y)`,
        output: `3 7
7 3`,
      },
      {
        type: "note",
        title: "Descriptive names win",
        text: "A short script can get away with x and y, but real programs read better with names like remaining_lives or total_points.",
        tone: "tip",
      },
    ],
    keyPoints: [
      "The assignment operator = attaches a value to a name.",
      "Use snake_case for variable names.",
      "Variable names cannot start with a number or contain spaces.",
      "Python variables can be reassigned to a different type.",
      "Tuple assignment makes swapping values easy.",
    ],
    practice:
      "Create variables for a player name, level, and score. Increase the score by 50 and print a sentence using all three values.",
  },
  {
    slug: "data-types",
    order: 4,
    module: "Working with data",
    title: "Data types",
    summary: "Understand numbers, text, true or false values, and Python's empty value.",
    description:
      "Every value in Python has a type. The type decides what the value can do and how Python treats it. This lesson covers the core built-in types you will use every day.",
    readTime: "7 min",
    icon: Type,
    objectives: [
      "Identify integers, floats, strings, and booleans",
      "Check a value's type with type()",
      "Use None to represent a missing value",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "A data type is a category of value. Python comes with many built-in types, but these five cover most beginner programs.",
      },
      {
        type: "table",
        headers: ["Type", "Meaning", "Examples"],
        rows: [
          ["int", "Whole numbers", "42, -7, 0"],
          ["float", "Numbers with a decimal point", "3.14, -0.5, 2.0"],
          ["str", "Text made of characters", "\"hello\", 'Python'"],
          ["bool", "True or false", "True, False"],
          ["NoneType", "Represents no value", "None"],
        ],
      },
      {
        type: "heading",
        text: "Checking a type",
      },
      {
        type: "paragraph",
        text: "The `type()` function tells you what kind of value you have. It is useful when you are not sure whether a number is an int or a float.",
      },
      {
        type: "code",
        caption: "types.py",
        code: `print(type(42))
print(type(3.14))
print(type("42"))
print(type(True))
print(type(None))`,
        output: `<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>`,
      },
      {
        type: "heading",
        text: "Strings",
      },
      {
        type: "paragraph",
        text: "Strings hold text. You can build them with single quotes, double quotes, or triple quotes for longer blocks of text. Strings are immutable, which means methods like `upper()` return a new string instead of changing the original.",
      },
      {
        type: "code",
        caption: "strings.py",
        code: `language = "Python"
print(language.upper())
print(language[0])
print(len(language))`,
        output: `PYTHON
P
6`,
      },
      {
        type: "heading",
        text: "Booleans and None",
      },
      {
        type: "paragraph",
        text: "Booleans have only two values: `True` and `False`. They are the result of comparisons and conditions. `None` is a special value that means the absence of a value, like an empty answer that has not been filled in yet.",
      },
      {
        type: "code",
        caption: "bool_none.py",
        code: `is_ready = True
winner = None

print(is_ready)
print(winner)
print(10 > 3)`,
        output: `True
None
True`,
      },
      {
        type: "note",
        title: "True is not the same as \"True\"",
        text: "True with no quotes is a boolean. \"True\" with quotes is a string that happens to contain the word True.",
        tone: "info",
      },
    ],
    keyPoints: [
      "int stores whole numbers and float stores decimal numbers.",
      "str stores text, bool stores True or False.",
      "None represents a missing or empty value.",
      "type() reveals the type of any value.",
      "The type of a value affects how it behaves.",
    ],
    practice:
      "Create one value of each core type, print each value, and print its type using type().",
  },
  {
    slug: "input-and-output",
    order: 5,
    module: "Working with data",
    title: "Input and output",
    summary: "Talk to the user with input() and print(), and format the results.",
    description:
      "Output lets a program show information. Input lets a user send information back. Together they turn a silent script into a conversation.",
    readTime: "6 min",
    icon: Keyboard,
    objectives: [
      "Print multiple values with print()",
      "Read user input with input()",
      "Format messages with f-strings",
    ],
    blocks: [
      {
        type: "heading",
        text: "Printing values",
      },
      {
        type: "paragraph",
        text: "`print()` can display more than one value. By default, Python puts a space between values and moves to a new line at the end. You can change that with the `sep` and `end` arguments.",
      },
      {
        type: "code",
        caption: "printing.py",
        code: `print("Python", "is", "fun")
print("A", "B", "C", sep="-")
print("No newline here", end=" ")
print("and this continues the line")`,
        output: `Python is fun
A-B-C
No newline here and this continues the line`,
      },
      {
        type: "heading",
        text: "Reading input",
      },
      {
        type: "paragraph",
        text: "`input()` pauses the program and waits for the user to type something. The text inside the parentheses is the prompt. The value that comes back is always a string.",
      },
      {
        type: "code",
        caption: "greeting.py",
        code: `name = input("What is your name? ")
print("Hello, " + name + "!")`,
        output: `What is your name? Ava
Hello, Ava!`,
      },
      {
        type: "heading",
        text: "F-strings",
      },
      {
        type: "paragraph",
        text: "An f-string is a string with an `f` before the opening quote. Anything inside curly braces is replaced with its value. It is the cleanest way to combine text and variables.",
      },
      {
        type: "code",
        caption: "fstrings.py",
        code: `name = input("Name: ")
age = input("Age: ")

print(f"{name} is {age} years old.")`,
        output: `Name: Sam
Age: 11
Sam is 11 years old.`,
      },
      {
        type: "note",
        title: "Input is always text",
        text: "Even if the user types 12, input() returns the string \"12\". Convert it with int() before doing math.",
        tone: "warning",
      },
      {
        type: "code",
        caption: "number_input.py",
        code: `age = int(input("Age: "))
next_age = age + 1
print(f"Next year you will be {next_age}.")`,
        output: `Age: 11
Next year you will be 12.`,
      },
    ],
    keyPoints: [
      "print() writes output to the screen.",
      "input() reads text typed by the user.",
      "input() always returns a string.",
      "F-strings insert values into text with curly braces.",
      "Convert input before using it as a number.",
    ],
    practice:
      "Ask for a name and a favorite color, then print a sentence such as \"Mia likes blue\" using an f-string.",
  },
  {
    slug: "type-conversion",
    order: 6,
    module: "Working with data",
    title: "Type conversion",
    summary: "Change values from one type to another without breaking your program.",
    description:
      "Sometimes a value starts as text but you need a number. Type conversion changes a value from one type to another, and Python gives you simple functions for the job.",
    readTime: "6 min",
    icon: RefreshCw,
    objectives: [
      "Convert between strings, integers, and floats",
      "Understand implicit and explicit conversion",
      "Handle invalid conversions safely",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "There are two kinds of conversion. Implicit conversion happens automatically when Python combines compatible types. Explicit conversion happens when you call a function such as `int()`, `float()`, or `str()` yourself.",
      },
      {
        type: "code",
        caption: "implicit.py",
        code: `whole = 5
decimal = 2.5

result = whole + decimal
print(result)
print(type(result))`,
        output: `7.5
<class 'float'>`,
      },
      {
        type: "heading",
        text: "The conversion functions",
      },
      {
        type: "table",
        headers: ["Function", "Converts to", "Example", "Result"],
        rows: [
          ["int()", "Integer", "int(\"25\")", "25"],
          ["float()", "Float", "float(\"2.5\")", "2.5"],
          ["str()", "String", "str(99)", "\"99\""],
          ["bool()", "Boolean", "bool(0)", "False"],
        ],
      },
      {
        type: "code",
        caption: "convert.py",
        code: `number_text = "25"
number = int(number_text)

price = float("19.99")
label = str(price)

print(number + 5)
print(price * 2)
print("Total: " + label)`,
        output: `30
39.98
Total: 19.99`,
      },
      {
        type: "heading",
        text: "When conversion fails",
      },
      {
        type: "paragraph",
        text: "`int(\"hello\")` cannot work because hello is not a number. Python raises a `ValueError`. In real programs you can catch that error with a `try` and `except` block.",
      },
      {
        type: "code",
        caption: "safe_convert.py",
        code: `text = input("Enter a number: ")

try:
    value = int(text)
    print(f"Doubled: {value * 2}")
except ValueError:
    print("That was not a whole number.")`,
        output: `Enter a number: abc
That was not a whole number.`,
      },
      {
        type: "note",
        title: "Watch out for bool()",
        text: "bool(\"False\") is True because any non-empty string is truthy. Only empty values such as \"\", 0, and None convert to False.",
        tone: "warning",
      },
      {
        type: "note",
        title: "Quotes change everything",
        text: "\"10\" + \"5\" joins two strings and gives \"105\". 10 + 5 adds two numbers and gives 15. Convert deliberately.",
        tone: "info",
      },
    ],
    keyPoints: [
      "Explicit conversion uses int(), float(), str(), or bool().",
      "Implicit conversion happens automatically when types mix.",
      "input() values usually need int() or float() before math.",
      "Invalid conversions raise ValueError.",
      "bool() treats non-empty strings and non-zero numbers as True.",
    ],
    practice:
      "Ask for two numbers, convert both with int(), and print their sum, difference, product, and quotient.",
  },
  {
    slug: "operators",
    order: 7,
    module: "Working with data",
    title: "Operators",
    summary: "Do math, compare values, and combine conditions with Python operators.",
    description:
      "Operators are symbols that perform actions on values. They let you calculate totals, compare scores, test membership, and build logical conditions.",
    readTime: "8 min",
    icon: Calculator,
    objectives: [
      "Use arithmetic and comparison operators",
      "Combine conditions with and, or, and not",
      "Understand operator precedence",
    ],
    blocks: [
      {
        type: "heading",
        text: "Arithmetic operators",
      },
      {
        type: "table",
        headers: ["Operator", "Name", "Example", "Result"],
        rows: [
          ["+", "Addition", "7 + 2", "9"],
          ["-", "Subtraction", "7 - 2", "5"],
          ["*", "Multiplication", "7 * 2", "14"],
          ["/", "Division", "7 / 2", "3.5"],
          ["//", "Floor division", "7 // 2", "3"],
          ["%", "Modulo", "7 % 2", "1"],
          ["**", "Exponent", "7 ** 2", "49"],
        ],
      },
      {
        type: "paragraph",
        text: "Regular division always returns a float. Floor division removes the decimal part. Modulo returns the remainder, which is useful for checking even and odd numbers.",
      },
      {
        type: "code",
        caption: "math.py",
        code: `print(10 / 4)
print(10 // 4)
print(10 % 4)
print(2 ** 5)`,
        output: `2.5
2
2
32`,
      },
      {
        type: "heading",
        text: "Comparison operators",
      },
      {
        type: "table",
        headers: ["Operator", "Meaning", "Example", "Result"],
        rows: [
          ["==", "Equal to", "5 == 5", "True"],
          ["!=", "Not equal to", "5 != 3", "True"],
          [">", "Greater than", "5 > 8", "False"],
          ["<", "Less than", "5 < 8", "True"],
          [">=", "Greater or equal", "5 >= 5", "True"],
          ["<=", "Less or equal", "5 <= 3", "False"],
        ],
      },
      {
        type: "heading",
        text: "Logical operators",
      },
      {
        type: "list",
        items: [
          "`and` is True only when both sides are True.",
          "`or` is True when at least one side is True.",
          "`not` flips True to False and False to True.",
        ],
      },
      {
        type: "code",
        caption: "logic.py",
        code: `age = 12
has_permission = True

print(age >= 10 and has_permission)
print(age < 5 or has_permission)
print(not has_permission)`,
        output: `True
True
False`,
      },
      {
        type: "heading",
        text: "Assignment and membership",
      },
      {
        type: "paragraph",
        text: "Shortcut assignment operators update a variable in place. Membership operators check whether a value appears inside a sequence.",
      },
      {
        type: "code",
        caption: "more_operators.py",
        code: `score = 10
score += 5
score *= 2

colors = ["red", "green", "blue"]
print(score)
print("green" in colors)
print("yellow" not in colors)`,
        output: `30
True
True`,
      },
      {
        type: "note",
        title: "Precedence",
        text: "Python follows the usual math order: parentheses first, then **, then * / // %, then + -, then comparisons, then not, and, or. Add parentheses when you want to be certain.",
        tone: "info",
      },
      {
        type: "note",
        title: "= is not ==",
        text: "A single equals sign assigns a value. A double equals sign compares two values. Mixing them up is a common beginner bug.",
        tone: "warning",
      },
    ],
    keyPoints: [
      "Arithmetic operators calculate new values.",
      "// returns a floored result and % returns the remainder.",
      "Comparison operators produce booleans.",
      "and, or, and not combine conditions.",
      "Use parentheses to make precedence obvious.",
    ],
    practice:
      "Create two number variables. Print their sum, remainder, and whether the first is greater than the second.",
  },
  {
    slug: "conditional-statements",
    order: 8,
    module: "Logic and collections",
    title: "Conditional statements",
    summary: "Make decisions in your programs with if, elif, and else.",
    description:
      "Conditional statements let a program choose between different paths. Python checks a condition, and runs only the block that matches.",
    readTime: "7 min",
    icon: GitBranch,
    objectives: [
      "Write if, elif, and else blocks",
      "Use indentation and colons correctly",
      "Combine conditions and understand truthiness",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "An `if` statement checks a condition. If the condition is True, the indented block runs. If it is False, Python skips that block. A colon marks the start of the block, and indentation marks what belongs to it.",
      },
      {
        type: "code",
        caption: "if_statement.py",
        code: `score = 85

if score >= 50:
    print("You passed!")
    print("Great work.")`,
        output: `You passed!
Great work.`,
      },
      {
        type: "heading",
        text: "Adding else",
      },
      {
        type: "paragraph",
        text: "`else` runs when the `if` condition was False. It has no condition of its own.",
      },
      {
        type: "code",
        caption: "if_else.py",
        code: `temperature = 18

if temperature > 25:
    print("Wear shorts.")
else:
    print("Bring a jacket.")`,
        output: `Bring a jacket.`,
      },
      {
        type: "heading",
        text: "Choosing between many options",
      },
      {
        type: "paragraph",
        text: "`elif` means else if. Python checks each condition from top to bottom and runs only the first block that matches. Once a match is found, the remaining branches are skipped.",
      },
      {
        type: "code",
        caption: "grade.py",
        code: `score = 78

if score >= 90:
    print("Grade A")
elif score >= 80:
    print("Grade B")
elif score >= 70:
    print("Grade C")
else:
    print("Keep practicing")`,
        output: `Grade C`,
      },
      {
        type: "heading",
        text: "Combining conditions",
      },
      {
        type: "paragraph",
        text: "You can use `and`, `or`, and `not` inside a condition. Parentheses help when the logic gets longer.",
      },
      {
        type: "code",
        caption: "combined.py",
        code: `age = 14
has_ticket = True

if age >= 13 and has_ticket:
    print("Welcome to the show!")
else:
    print("Sorry, entry is not allowed.")`,
        output: `Welcome to the show!`,
      },
      {
        type: "heading",
        text: "Truthiness and short form",
      },
      {
        type: "paragraph",
        text: "Values such as `0`, `\"\"`, `[]`, and `None` are treated as False. Other values are treated as True. For a simple choice, Python also supports a one-line conditional expression.",
      },
      {
        type: "code",
        caption: "truthy.py",
        code: `name = ""

if name:
    print(f"Hello, {name}")
else:
    print("Name is missing")

status = "ready" if name else "waiting"
print(status)`,
        output: `Name is missing
waiting`,
      },
      {
        type: "note",
        title: "Order matters",
        text: "In an if/elif chain, put the most specific condition first. If a broad condition is checked first, later branches may never run.",
        tone: "warning",
      },
    ],
    keyPoints: [
      "if runs a block only when its condition is True.",
      "elif checks another condition after an earlier one fails.",
      "else handles every remaining case.",
      "Colons start a block and indentation defines its body.",
      "Empty values such as 0 and \"\" are falsy.",
    ],
    practice:
      "Ask for a score. Print A for 90 or more, B for 80 or more, C for 70 or more, and \"Keep practicing\" for anything lower.",
  },
  {
    slug: "lists",
    order: 9,
    module: "Logic and collections",
    title: "Lists",
    summary: "Store an ordered collection of values and change it as your program runs.",
    description:
      "A list is an ordered, mutable collection. It is the most common way to store many values in Python, such as a list of scores, names, or tasks.",
    readTime: "8 min",
    icon: List,
    objectives: [
      "Create lists and access items by index",
      "Add, change, and remove items",
      "Loop over a list and use common methods",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Lists are written with square brackets. Items are separated by commas and keep the order you give them. A list can hold any type, and it can mix types.",
      },
      {
        type: "code",
        caption: "lists.py",
        code: `colors = ["red", "green", "blue"]
scores = [95, 82, 78]
mixed = ["Mia", 12, True]

print(colors)
print(colors[0])
print(colors[-1])
print(len(scores))`,
        output: `['red', 'green', 'blue']
red
blue
3`,
      },
      {
        type: "heading",
        text: "Indexing and slicing",
      },
      {
        type: "paragraph",
        text: "Indexes start at 0. Negative indexes count from the end. A slice takes a range of items: the start is included and the end is excluded.",
      },
      {
        type: "code",
        caption: "slicing.py",
        code: `letters = ["a", "b", "c", "d", "e"]

print(letters[1:4])
print(letters[:2])
print(letters[3:])
print(letters[::2])`,
        output: `['b', 'c', 'd']
['a', 'b']
['d', 'e']
['a', 'c', 'e']`,
      },
      {
        type: "heading",
        text: "Changing a list",
      },
      {
        type: "paragraph",
        text: "Lists are mutable, so you can change them after they are created.",
      },
      {
        type: "code",
        caption: "modify.py",
        code: `tasks = ["read", "code"]

tasks.append("play")
tasks.insert(1, "stretch")
tasks[0] = "study"
tasks.remove("code")

print(tasks)
print(tasks.pop())
print(tasks)`,
        output: `['study', 'stretch', 'play']
play
['study', 'stretch']`,
      },
      {
        type: "heading",
        text: "Looping and sorting",
      },
      {
        type: "code",
        caption: "loop_lists.py",
        code: `scores = [72, 95, 88]

for score in scores:
    print(f"Score: {score}")

scores.sort()
print(scores)
scores.sort(reverse=True)
print(scores)`,
        output: `Score: 72
Score: 95
Score: 88
[72, 88, 95]
[95, 88, 72]`,
      },
      {
        type: "note",
        title: "Mutable means shared changes",
        text: "Assigning one list to another name does not copy it. Both names point to the same list. Use copy() or a slice when you need an independent copy.",
        tone: "info",
      },
      {
        type: "note",
        title: "Watch the index",
        text: "A list with three items has indexes 0, 1, and 2. Using index 3 raises an IndexError.",
        tone: "warning",
      },
    ],
    keyPoints: [
      "Lists are ordered and mutable.",
      "Indexing starts at 0 and negative indexes count from the end.",
      "append() adds to the end and insert() adds at a position.",
      "remove() deletes by value and pop() deletes by position.",
      "sort() changes the list in place.",
    ],
    practice:
      "Create a list of five favorite foods. Add a new food, remove one, sort the list, and print each item with a loop.",
  },
  {
    slug: "tuples",
    order: 10,
    module: "Logic and collections",
    title: "Tuples",
    summary: "Use ordered collections that cannot change after they are created.",
    description:
      "A tuple is like a list that cannot be modified. Tuples are perfect for fixed groups of values, such as coordinates or a date.",
    readTime: "6 min",
    icon: Package,
    objectives: [
      "Create tuples and access their items",
      "Unpack tuple values into variables",
      "Know when to choose a tuple instead of a list",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Tuples are written with parentheses and commas. They keep their order and support indexing and slicing, just like lists. The big difference is that tuples are immutable: after creation, their items cannot be added, removed, or replaced.",
      },
      {
        type: "code",
        caption: "tuples.py",
        code: `point = (4, 7)
rgb = ("red", "green", "blue")

print(point)
print(point[0])
print(rgb[1:])
print(len(point))`,
        output: `(4, 7)
4
('green', 'blue')
2`,
      },
      {
        type: "heading",
        text: "A single item needs a comma",
      },
      {
        type: "paragraph",
        text: "Parentheses alone do not create a tuple. The comma does. A one-item tuple needs a trailing comma.",
      },
      {
        type: "code",
        caption: "single_tuple.py",
        code: `not_a_tuple = ("hello")
real_tuple = ("hello",)

print(type(not_a_tuple))
print(type(real_tuple))`,
        output: `<class 'str'>
<class 'tuple'>`,
      },
      {
        type: "heading",
        text: "Unpacking",
      },
      {
        type: "paragraph",
        text: "You can unpack a tuple into separate variables in one line. This is useful for returning several related values from a function.",
      },
      {
        type: "code",
        caption: "unpack.py",
        code: `person = ("Ava", 11, "blue")

name, age, color = person
print(name)
print(age)
print(color)`,
        output: `Ava
11
blue`,
      },
      {
        type: "heading",
        text: "Tuple or list?",
      },
      {
        type: "table",
        headers: ["Feature", "List", "Tuple"],
        rows: [
          ["Can change", "Yes", "No"],
          ["Syntax", "[1, 2, 3]", "(1, 2, 3)"],
          ["Best for", "Changing collections", "Fixed records"],
          ["Methods", "Many", "Only count() and index()"],
        ],
      },
      {
        type: "note",
        title: "Immutability protects data",
        text: "If a group of values should never change, a tuple makes that rule clear and prevents accidental edits.",
        tone: "tip",
      },
    ],
    keyPoints: [
      "Tuples are ordered but immutable.",
      "A single-item tuple needs a trailing comma.",
      "Indexing and slicing work the same as with lists.",
      "Unpacking assigns items to separate variables.",
      "Use tuples for fixed groups of values.",
    ],
    practice:
      "Create a tuple with a city name, latitude, and longitude. Unpack it and print a sentence using all three values.",
  },
  {
    slug: "dictionaries",
    order: 11,
    module: "Logic and collections",
    title: "Dictionaries",
    summary: "Store values under meaningful keys instead of numeric positions.",
    description:
      "A dictionary stores key-value pairs. Instead of looking items up by position, you look them up by a key such as a name, an id, or a word.",
    readTime: "8 min",
    icon: Database,
    objectives: [
      "Create dictionaries and read values by key",
      "Add, update, and delete entries",
      "Loop over keys, values, and items",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Dictionaries are written with curly braces. Each entry has a key, a colon, and a value. Keys must be unique. If you use the same key twice, the last value wins.",
      },
      {
        type: "code",
        caption: "dictionaries.py",
        code: `student = {
    "name": "Noah",
    "age": 12,
    "grade": "7",
}

print(student["name"])
print(student["age"])
print(len(student))`,
        output: `Noah
12
3`,
      },
      {
        type: "heading",
        text: "Safe access with get()",
      },
      {
        type: "paragraph",
        text: "Reading a missing key with square brackets raises a KeyError. The `get()` method returns None or a default value instead, which is often safer.",
      },
      {
        type: "code",
        caption: "get.py",
        code: `student = {"name": "Noah", "age": 12}

print(student.get("name"))
print(student.get("grade"))
print(student.get("grade", "not set"))`,
        output: `Noah
None
not set`,
      },
      {
        type: "heading",
        text: "Updating and deleting",
      },
      {
        type: "code",
        caption: "update.py",
        code: `student = {"name": "Noah", "age": 12}

student["age"] = 13
student["grade"] = "7"
student.pop("name")

print(student)`,
        output: `{'age': 13, 'grade': '7'}`,
      },
      {
        type: "heading",
        text: "Looping over a dictionary",
      },
      {
        type: "paragraph",
        text: "A dictionary keeps insertion order. Looping over it directly gives you keys. Use `values()` for values and `items()` for both.",
      },
      {
        type: "code",
        caption: "loop_dict.py",
        code: `scores = {"Mia": 95, "Leo": 82, "Ava": 88}

for name, score in scores.items():
    print(f"{name}: {score}")

print(scores.keys())
print(scores.values())`,
        output: `Mia: 95
Leo: 82
Ava: 88
dict_keys(['Mia', 'Leo', 'Ava'])
dict_values([95, 82, 88])`,
      },
      {
        type: "note",
        title: "Keys must be hashable",
        text: "Strings, numbers, and tuples can be keys. Lists and dictionaries cannot, because they can change.",
        tone: "info",
      },
      {
        type: "note",
        title: "Dictionary or list?",
        text: "Use a list when order matters and you access items by position. Use a dictionary when you need to look values up by a meaningful key.",
        tone: "tip",
      },
    ],
    keyPoints: [
      "Dictionaries store key-value pairs.",
      "Keys are unique and must be hashable.",
      "Use get() to avoid KeyError for missing keys.",
      "Assigning to a new key adds it to the dictionary.",
      "items() loops over keys and values together.",
    ],
    practice:
      "Create a dictionary with three friends and their ages. Add a fourth friend, update one age, and print each name with their age.",
  },
  {
    slug: "sets",
    order: 12,
    module: "Logic and collections",
    title: "Sets",
    summary: "Work with unique values and compare groups with set operations.",
    description:
      "A set is an unordered collection of unique values. Sets are excellent for removing duplicates and for asking questions such as what two groups share.",
    readTime: "7 min",
    icon: Layers,
    objectives: [
      "Create sets and add or remove values",
      "Use union, intersection, and difference",
      "Remove duplicates from a list",
    ],
    blocks: [
      {
        type: "paragraph",
        text: "Sets are written with curly braces, like dictionaries, but they contain single values instead of key-value pairs. Duplicate values are removed automatically, and the order is not guaranteed.",
      },
      {
        type: "code",
        caption: "sets.py",
        code: `colors = {"red", "green", "blue", "red"}

print(colors)
print(len(colors))
print("green" in colors)`,
        output: `{'red', 'green', 'blue'}
3
True`,
      },
      {
        type: "note",
        title: "An empty set is set()",
        text: "{} creates an empty dictionary, not a set. Use set() when you need an empty set.",
        tone: "warning",
      },
      {
        type: "heading",
        text: "Adding and removing",
      },
      {
        type: "code",
        caption: "change_sets.py",
        code: `tags = {"python", "beginner"}

tags.add("coding")
tags.discard("beginner")

print(tags)`,
        output: `{'python', 'coding'}`,
      },
      {
        type: "heading",
        text: "Set operations",
      },
      {
        type: "table",
        headers: ["Operation", "Meaning", "Symbol"],
        rows: [
          ["Union", "Everything in both sets", "| or union()"],
          ["Intersection", "Only what both sets share", "& or intersection()"],
          ["Difference", "In the first set but not the second", "- or difference()"],
        ],
      },
      {
        type: "code",
        caption: "operations.py",
        code: `frontend = {"html", "css", "javascript"}
backend = {"python", "javascript", "sql"}

print(frontend | backend)
print(frontend & backend)
print(frontend - backend)`,
        output: `{'html', 'css', 'javascript', 'python', 'sql'}
{'javascript'}
{'html', 'css'}`,
      },
      {
        type: "heading",
        text: "Removing duplicates",
      },
      {
        type: "paragraph",
        text: "Converting a list to a set is a quick way to remove repeated values. If you need the result as a list, convert it back. Remember that the original order is not preserved.",
      },
      {
        type: "code",
        caption: "dedupe.py",
        code: `votes = ["red", "blue", "red", "green", "blue"]
unique_votes = set(votes)

print(unique_votes)
print(list(unique_votes))`,
        output: `{'red', 'blue', 'green'}
['red', 'blue', 'green']`,
      },
      {
        type: "note",
        title: "No index access",
        text: "Sets do not support indexing because they have no fixed order. Use them for membership tests and comparisons, not for storing ordered data.",
        tone: "info",
      },
    ],
    keyPoints: [
      "Sets hold unique values and have no guaranteed order.",
      "Duplicate values are removed automatically.",
      "add() inserts a value and discard() removes one safely.",
      "Union, intersection, and difference compare sets.",
      "set(list) is a quick way to remove duplicates.",
    ],
    practice:
      "Create two sets of hobbies for two friends. Print what they share, what only the first friend likes, and all of their hobbies combined.",
  },
];

export const lessonModules: LessonModule[] = [
  "Getting started",
  "Working with data",
  "Logic and collections",
];

export function getLessonBySlug(slug: string) {
  return pythonLessons.find((lesson) => lesson.slug === slug);
}

export function getLessonNeighbors(slug: string) {
  const index = pythonLessons.findIndex((lesson) => lesson.slug === slug);

  return {
    previous: index > 0 ? pythonLessons[index - 1] : null,
    next:
      index >= 0 && index < pythonLessons.length - 1
        ? pythonLessons[index + 1]
        : null,
  };
}
