interface Props {
  label: string
  value: string | number
}

export function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-xl bg-gray-100 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  )
}