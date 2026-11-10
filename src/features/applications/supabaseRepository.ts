import { supabase } from '../../lib/supabase'
import type { ApplicationRepository } from './repository'
import type { Application, Status, StatusChange } from './types'

const FIELD_TO_COLUMN = {
  company: 'company',
  role: 'role',
  status: 'status',
  link: 'link',
  location: 'location',
  salaryMin: 'salary_min',
  salaryMax: 'salary_max',
  notes: 'notes',
  appliedAt: 'applied_at',
  followUpAt: 'follow_up_at',
  position: 'position',
  history: 'history',
} as const

type Row = Record<string, unknown>

function db() {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}


export function toRow(patch: Partial<Application>): Row {
  const row: Row = {}
  for (const [field, column] of Object.entries(FIELD_TO_COLUMN)) {
    if (field in patch) row[column] = patch[field as keyof Application] ?? null
  }
  return row
}


export function fromRow(row: Row): Application {
  const app: Record<string, unknown> = {
    id: row.id,
    createdAt: row.created_at,
  }
  for (const [field, column] of Object.entries(FIELD_TO_COLUMN)) {
    app[field] = row[column] ?? undefined
  }
  return app as unknown as Application
}

export const supabaseRepository: ApplicationRepository = {
  async list() {
    const { data, error } = await db()
      .from('applications')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []).map(fromRow)
  },

  async create(input) {
    const { count, error: countError } = await db()
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', input.status)
    if (countError) throw countError

    const { data, error } = await db()
      .from('applications')
      .insert({
        ...toRow(input),
        position: count ?? 0,
        history: input.history ?? [{ status: input.status, at: new Date().toISOString() }],
      })
      .select()
      .single()
    if (error) throw error
    return fromRow(data)
  },

  async update(id, patch) {
    const row = toRow(patch)

    
    if (patch.status) {
      const { data: current, error: readError } = await db()
        .from('applications')
        .select('status, history, created_at')
        .eq('id', id)
        .single()
      if (readError) throw readError
      if (current.status !== patch.status) {
        const past: StatusChange[] = current.history?.length
          ? current.history
          : [{ status: current.status as Status, at: current.created_at as string }]
        row.history = [...past, { status: patch.status, at: new Date().toISOString() }]
      }
    }

    const { data, error } = await db()
      .from('applications')
      .update(row)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return fromRow(data)
  },

  async remove(id) {
    const { error } = await db().from('applications').delete().eq('id', id)
    if (error) throw error
  },
}
