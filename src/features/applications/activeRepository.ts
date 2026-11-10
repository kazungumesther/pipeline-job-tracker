import { isSupabaseConfigured } from '../../lib/supabase'
import { localRepository } from './repository'
import { supabaseRepository } from './supabaseRepository'


export const repository = isSupabaseConfigured ? supabaseRepository : localRepository
