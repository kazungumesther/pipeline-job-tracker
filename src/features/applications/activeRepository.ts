import { isSupabaseConfigured } from '../../lib/supabase'
import { localRepository } from './repository'
import { supabaseRepository } from './supabaseRepository'

// The one place that decides where data lives. Everything else talks to the
// ApplicationRepository interface and never knows which implementation it got.
export const repository = isSupabaseConfigured ? supabaseRepository : localRepository
