import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RegistrationLineChartProps = {
  data: { label: string; count: number }[];
};

const WIDTH = 640;
const HEIGHT = 240;
const PADDING = { top: 20, right: 20, bottom: 34, left: 40 };

export function RegistrationLineChart({ data }: RegistrationLineChartProps) {
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(...data.map((item) => item.count), 1);
  const step = data.length > 1 ? chartWidth / (data.length - 1) : 0;

  const points = data.map((item, index) => ({
    x: PADDING.left + index * step,
    y: PADDING.top + chartHeight * (1 - item.count / max),
    ...item,
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `M ${points[0].x} ${PADDING.top + chartHeight} ${points
          .map((point) => `L ${point.x} ${point.y}`)
          .join(" ")} L ${points[points.length - 1].x} ${
          PADDING.top + chartHeight
        } Z`
      : "";

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const y = PADDING.top + (chartHeight / 4) * index;
    const value = Math.round(max - (max / 4) * index);

    return { y, value };
  });

  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardTitle>User registrations</CardTitle>
        <CardDescription>New accounts over the last 6 months</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No registration data yet.
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Line chart of user registrations over the last 6 months"
            className="h-auto w-full text-[#3902FF] dark:text-[#7B5CFF]"
          >
            {gridLines.map((line) => (
              <g key={line.y}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={line.y}
                  y2={line.y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                />
                <text
                  x={PADDING.left - 8}
                  y={line.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  {line.value}
                </text>
              </g>
            ))}

            <path d={areaPath} fill="currentColor" opacity="0.12" />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="var(--card)"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <text
                  x={point.x}
                  y={HEIGHT - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--muted-foreground)"
                >
                  {point.label}
                </text>
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="currentColor"
                >
                  {point.count}
                </text>
              </g>
            ))}
          </svg>
        )}
      </CardContent>
    </Card>
  );
}
