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
import { useApplications } from '../features/applications/hooks'
import { applicationsPerWeek, funnel, responseRate } from '../features/analytics/stats'

export function AnalyticsPage() {
  const { data = [], isLoading } = useApplications()

  if (isLoading) return <p className="p-6">Loading…</p>

  const steps = funnel(data)
  const [applied, interview, offer] = steps
  const weekly = applicationsPerWeek(data)

  if (applied.count === 0) {
    return (
      <p className="p-6 text-gray-600">
        No applications yet. Move a card to Applied on the board and your stats will show up here.
      </p>
    )
  }

  return (
    <div className="space-y-8 p-6">
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
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
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={steps} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
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