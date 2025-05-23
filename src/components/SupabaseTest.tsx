'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [testIdea, setTestIdea] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Insert a test idea
      const { data: insertData, error: insertError } = await supabase
        .from('ideas')
        .insert([
          {
            title: 'Test Connection Idea',
            description: 'This is a test idea to verify database connection',
            category: 'technology'
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError
      setTestIdea(insertData)

      // Test 2: Read the test idea
      const { data: readData, error: readError } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', insertData.id)
        .single()

      if (readError) throw readError

      // Test 3: Delete the test idea
      const { error: deleteError } = await supabase
        .from('ideas')
        .delete()
        .eq('id', insertData.id)

      if (deleteError) throw deleteError

      setConnectionStatus('success')
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-500' :
            connectionStatus === 'success' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span>
            {connectionStatus === 'testing' ? 'Testing connection...' :
             connectionStatus === 'success' ? 'Connection successful!' :
             'Connection failed'}
          </span>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm">
            Error: {errorMessage}
          </div>
        )}

        {testIdea && (
          <div className="text-sm text-gray-600">
            Test idea created and deleted successfully with ID: {testIdea.id}
          </div>
        )}

        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Run Test Again
        </button>
      </div>
    </div>
  )
} 