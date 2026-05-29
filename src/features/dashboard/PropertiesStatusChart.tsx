import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface Row {
  status: string
  label: string
  count: number
}

const chartConfig = {
  count: { label: "Properties" },
  "pending-approval": {
    label: "Pending approval",
    color: "var(--color-warning)",
  },
  published: { label: "Published", color: "var(--status-available)" },
  "under-offer": { label: "Under offer", color: "var(--color-info)" },
  sold: { label: "Sold", color: "var(--color-chart-1)" },
  rented: { label: "Rented", color: "var(--color-chart-4)" },
} satisfies ChartConfig

function colorFor(status: string) {
  const entry = chartConfig[status as keyof typeof chartConfig]
  return (
    entry && "color" in entry ? entry.color : "var(--color-primary)"
  ) as string
}

function tickLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function PropertiesStatusChart({ data }: { data: Row[] }) {
  // Inject `fill` into each row so ChartTooltipContent picks it up automatically
  const enriched = data.map((row) => ({ ...row, fill: colorFor(row.status) }))

  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
        No property data yet
      </div>
    )
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[260px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground"
    >
      <BarChart
        accessibilityLayer
        data={enriched}
        layout="vertical"
        margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
      >
        <CartesianGrid
          horizontal={false}
          strokeDasharray="3 3"
          stroke="var(--color-border)"
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <YAxis
          type="category"
          dataKey="label"
          tickFormatter={tickLabel}
          tickLine={false}
          axisLine={false}
          width={110}
          fontSize={11}
        />
        <ChartTooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
          content={<ChartTooltipContent hideLabel />}
        />
        {/* No Cell needed — fill on the data row drives both bar color and tooltip */}
        <Bar dataKey="count" radius={[0, 6, 6, 0]} fillOpacity={0.9} />
      </BarChart>
    </ChartContainer>
  )
}
