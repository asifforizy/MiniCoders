import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RolePieChartProps = {
  data: { label: string; value: number }[];
};

const COLORS = [
  "oklch(0.62 0.19 265)",
  "oklch(0.72 0.15 160)",
  "oklch(0.78 0.16 85)",
];

const SIZE = 200;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 82;
const INNER_RADIUS = 52;

function polarPoint(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function arcPath(startAngle: number, endAngle: number) {
  const safeEnd = Math.min(endAngle, startAngle + 359.99);
  const outerStart = polarPoint(OUTER_RADIUS, startAngle);
  const outerEnd = polarPoint(OUTER_RADIUS, safeEnd);
  const innerEnd = polarPoint(INNER_RADIUS, safeEnd);
  const innerStart = polarPoint(INNER_RADIUS, startAngle);
  const largeArc = safeEnd - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export function RolePieChart({ data }: RolePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const sweeps = data.map((item) =>
    total === 0 ? 0 : (item.value / total) * 360
  );

  const slices = data.map((item, index) => {
    const start = sweeps
      .slice(0, index)
      .reduce((sum, sweep) => sum + sweep, 0);

    return {
      ...item,
      start,
      end: start + sweeps[index],
      color: COLORS[index % COLORS.length],
      percent: total === 0 ? 0 : Math.round((item.value / total) * 100),
    };
  });

  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <CardTitle>Accounts by role</CardTitle>
        <CardDescription>Distribution of users across roles</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="relative">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="Pie chart of accounts by role"
              className="size-44"
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={(OUTER_RADIUS + INNER_RADIUS) / 2}
                fill="none"
                stroke="var(--muted)"
                strokeWidth={OUTER_RADIUS - INNER_RADIUS}
              />

              {slices
                .filter((slice) => slice.value > 0)
                .map((slice) => (
                  <path
                    key={slice.label}
                    d={arcPath(slice.start, slice.end)}
                    fill={slice.color}
                  />
                ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums">
                {total}
              </span>
              <span className="text-xs text-muted-foreground">users</span>
            </div>
          </div>

          <ul className="space-y-3">
            {slices.map((slice) => (
              <li key={slice.label} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="min-w-24 text-muted-foreground">
                  {slice.label}
                </span>
                <span className="font-medium tabular-nums">{slice.value}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {slice.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
