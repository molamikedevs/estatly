import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Cell, Label, Pie, PieChart } from "recharts"

interface Row {
  status: string
  label: string
  count: number
}

const chartConfig = {
  count: { label: "Clients" },
  active: { label: "Active", color: "var(--color-success)" },
  "closed-won": { label: "Closed won", color: "var(--color-info)" },
  "closed-lost": { label: "Closed lost", color: "var(--color-destructive)" },
  inactive: {
    label: "Inactive",
    color: "var(--color-muted-foreground)",
  },
} satisfies ChartConfig

function colorFor(status: string) {
  const entry = chartConfig[status as keyof typeof chartConfig] as
    | { color?: string }
    | undefined

  return entry?.color ?? "var(--color-muted-foreground)"
}

function labelFor(status: string) {
  const entry = chartConfig[status as keyof typeof chartConfig]
  return (entry && "label" in entry ? entry.label : status) as string
}

export default function ClientsPipelineChart({ data }: { data: Row[] }) {
  const total = data.reduce((sum, r) => sum + r.count, 0)

  if (!data.length || total === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
        No client data yet
      </div>
    )
  }

  return (
    <div className="flex h-[260px] flex-col items-center gap-3 sm:flex-row sm:gap-5">
      <ChartContainer
        config={chartConfig}
        className="aspect-square h-full max-h-[200px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={52}
            outerRadius={84}
            strokeWidth={2}
            stroke="var(--color-card)"
          >
            {data.map((row) => (
              <Cell key={row.status} fill={colorFor(row.status)} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 6}
                      className="tabular fill-foreground text-xl font-semibold"
                    >
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 12}
                      className="fill-muted-foreground text-[10px] tracking-wider uppercase"
                    >
                      Total
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend */}
      <ul className="flex flex-1 flex-col gap-2 text-xs">
        {data.map((row) => (
          <li
            key={row.status}
            className="flex items-center gap-2 border-b border-border/60 pb-2 last:border-0"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: colorFor(row.status) }}
            />
            <span className="flex-1 capitalize">{labelFor(row.status)}</span>
            <span className="tabular font-medium">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
