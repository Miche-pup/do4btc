"use client";
import { useState } from 'react'

interface IdeaFormProps {
  onSubmit?: (data: { name: string; headline: string; lightning: string; idea: string }) => void
}

export default function IdeaForm({ onSubmit }: IdeaFormProps) {
  const [form, setForm] = useState({
    name: '',
    headline: '',
    lightning: '',
    idea: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (onSubmit) {
      onSubmit({ ...form, headline: form.headline.trim() })
    }
    setForm({ name: '', headline: '', lightning: '', idea: '' })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        type="text"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="rounded-md px-4 py-2 bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Your Name"
      />
      <input
        name="headline"
        type="text"
        placeholder="Catchy Headline"
        value={form.headline}
        onChange={handleChange}
        className="rounded-md px-4 py-2 bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Catchy Headline"
      />
      <input
        name="lightning"
        type="text"
        placeholder="Your Lightning Address"
        value={form.lightning}
        onChange={handleChange}
        className="rounded-md px-4 py-2 bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Your Lightning Address"
      />
      <textarea
        name="idea"
        placeholder="How can we add value to Bitcoin?"
        value={form.idea}
        onChange={handleChange}
        className="rounded-md px-4 py-2 bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px] resize-none"
        aria-label="How can we add value to Bitcoin?"
      />
      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
        aria-label="Submit Idea"
        disabled={isSubmitting}
      >
        Submit Idea
      </button>
    </form>
  )
} 