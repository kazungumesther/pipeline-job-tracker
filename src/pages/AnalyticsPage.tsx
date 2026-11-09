import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StatCard } from '../components/analytics/StatCard'
import { applicationsPerWeek, funnel, responseRate } from '../features/analytics/stats'
import { useApplications } from '../features/applications/hooks'

export function AnalyticsPage() {
  const { data = [], isLoading } = useApplications()

  if (isLoading) return <p className="p-6">Loading…</p>

  const steps = funnel(data)
  const [applied, interview, offer] = steps
  const weekly = applicationsPerWeek(data)

  if (applied.count === 0) {
    return (
      <p className="p-6 text-gray-600 dark:text-gray-400">
        No applications yet. Move a card to Applied on the board and your stats will show up here.
      </p>
    )
  }

  const weeklySummary = weekly.map((w) => `${w.week}: ${w.count}`).join(', ')
  const funnelSummary = steps.map((s) => `${s.stage}: ${s.count}`).join(', ')

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Applied" value={applied.count} />
        <StatCard label="Interviews" value={interview.count} />
        <StatCard label="Offers" value={offer.count} />
        <StatCard label="Response rate" value={`${Math.round(responseRate(data) * 100)}%`} />
      </div>

      <section aria-labelledby="weekly-heading">
        <h2 id="weekly-heading" className="mb-2 font-semibold">
          Applications per week
        </h2>
        <div className="h-64" role="img" aria-label={`Applications per week. ${weeklySummary}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Applications" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-labelledby="funnel-heading">
        <h2 id="funnel-heading" className="mb-2 font-semibold">
          Funnel
        </h2>
        <div className="h-48" role="img" aria-label={`Funnel. ${funnelSummary}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={steps} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="stage" width={80} />
              <Tooltip />
              <Bar dataKey="count" name="Applications" fill="#16a34a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
