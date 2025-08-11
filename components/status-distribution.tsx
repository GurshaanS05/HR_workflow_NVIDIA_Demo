import { CardContent } from "@/components/ui/card"

interface StatusDistributionProps {
  data: { name: string; value: number }[]
  totalTransfers: number
  colors: Record<string, string>
}

export function StatusDistribution({ data, totalTransfers, colors }: StatusDistributionProps) {
  return (
    <CardContent className="p-0 space-y-3">
      {data.map((status) => (
        <div key={status.name} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: colors[status.name] }} />
          <div className="flex-1 text-sm font-medium">{status.name}</div>
          <div className="text-sm text-muted-foreground">{status.value}</div>
          {totalTransfers > 0 && (
            <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(status.value / totalTransfers) * 100}%`,
                  backgroundColor: colors[status.name],
                }}
              />
            </div>
          )}
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-10">No transfers to display status.</div>
      )}
    </CardContent>
  )
}
