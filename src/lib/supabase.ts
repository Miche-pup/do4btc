import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Type for our form submissions
export type FormSubmission = {
  id?: string
  title: string
  description: string
  category: string
  created_at?: string
  user_id?: string
  status?: 'pending' | 'approved' | 'rejected'
  votes?: number
}

// Helper function to get ideas with pagination
export async function getIdeas(page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('ideas')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    ideas: data,
    total: count || 0,
    page,
    pageSize,
  }
}

// Helper function to add a vote to an idea
export async function addVote(ideaId: string) {
  const { error } = await supabase.rpc('increment_votes', { idea_id: ideaId })
  if (error) throw error
} 