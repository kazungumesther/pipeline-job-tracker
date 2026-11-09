import type { Application } from './types'

const COLUMNS: { header: string; value: (a: Application) => string | number | undefined }[] = [
  { header: 'Company', value: (a) => a.company },
  { header: 'Role', value: (a) => a.role },
  { header: 'Status', value: (a) => a.status },
  { header: 'Location', value: (a) => a.location },
  { header: 'Link', value: (a) => a.link },
  { header: 'Salary min', value: (a) => a.salaryMin },
  { header: 'Salary max', value: (a) => a.salaryMax },
  { header: 'Applied', value: (a) => a.appliedAt?.slice(0, 10) },
  { header: 'Follow up', value: (a) => a.followUpAt?.slice(0, 10) },
  { header: 'Notes', value: (a) => a.notes },
]

function cell(value: string | number | undefined): string {
  if (value === undefined) return ''
  let text = String(value)
  // Spreadsheet apps run cells that start with = + - @ as formulas, which is a known
  // injection risk for exported data. A leading quote makes them plain text.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(items: Application[]): string {
  const header = COLUMNS.map((c) => c.header).join(',')
  const rows = items.map((a) => COLUMNS.map((c) => cell(c.value(a))).join(','))
  return [header, ...rows].join('\r\n')
}

export function downloadCsv(items: Application[], filename = 'pipeline-applications.csv') {
  // The BOM makes Excel read the file as UTF-8.
  const blob = new Blob(['\ufeff' + toCsv(items)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
