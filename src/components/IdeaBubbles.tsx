'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { FormSubmission } from '@/lib/supabase'

export default function IdeaBubbles() {
  const [ideas, setIdeas] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchIdeas()

    // Subscribe to changes
    const subscription = supabase
      .channel('ideas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, () => {
        fetchIdeas()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center">Loading ideas...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
          <p className="text-gray-600 mb-4">{idea.description}</p>
          <div className="flex justify-between items-center">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {idea.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(idea.created_at!).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 