"use client";
import { useState, useRef, useEffect } from 'react'
import IdeaForm from '@/components/IdeaForm'
import Link from 'next/link'
import { supabase, addVote } from '@/lib/supabase'
import LightningPayment from '@/components/LightningPayment'

// Types for bubble
interface BubbleData {
  id: number
  name: string
  headline: string
  lightning: string
  idea: string
  x: number // vw
  y: number // vh
  dx: number
  dy: number
  paused?: boolean
  votes: number
}

// Bubble component for animated headline
const Bubble = ({
  id,
  name,
  headline,
  lightning,
  idea,
  x,
  y,
  dx,
  dy,
  paused,
  expanded,
  onMove,
  onExpand,
  onCollapse,
  votes,
}: BubbleData & {
  expanded: boolean
  onMove: (id: number, x: number, y: number, dx: number, dy: number) => void
  onExpand: (id: number) => void
  onCollapse: () => void
}) => {
  const requestRef = useRef<number>()
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (paused || expanded) return
    let pos = { x, y, dx, dy }
    const animate = () => {
      pos.x += pos.dx * 0.5 // Slow down by 50%
      pos.y += pos.dy * 0.5 // Slow down by 50%
      // Bounce off edges with random angle
      let bounced = false
      if (pos.x < 5 || pos.x > 95) {
        pos.dx = -pos.dx
        // Add random angle
        const angle = (Math.random() - 0.5) * (Math.PI / 6) // +/- 15 degrees
        const speed = Math.sqrt(pos.dx * pos.dx + pos.dy * pos.dy)
        const newAngle = Math.atan2(pos.dy, pos.dx) + angle
        pos.dx = Math.cos(newAngle) * speed
        pos.dy = Math.sin(newAngle) * speed
        bounced = true
      }
      if (pos.y < 5 || pos.y > 85) {
        pos.dy = -pos.dy
        // Add random angle
        const angle = (Math.random() - 0.5) * (Math.PI / 6) // +/- 15 degrees
        const speed = Math.sqrt(pos.dx * pos.dx + pos.dy * pos.dy)
        const newAngle = Math.atan2(pos.dy, pos.dx) + angle
        pos.dx = Math.cos(newAngle) * speed
        pos.dy = Math.sin(newAngle) * speed
        bounced = true
      }
      pos.x = Math.max(5, Math.min(95, pos.x))
      pos.y = Math.max(5, Math.min(85, pos.y))
      onMove(id, pos.x, pos.y, pos.dx, pos.dy)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
    // eslint-disable-next-line
  }, [paused, expanded])

  // Expand on click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Bubble clicked:', id, 'expanded:', expanded)
    if (!expanded) {
      onExpand(id)
    }
  }

  // Collapse on outside click
  useEffect(() => {
    if (!expanded) return
    const handleOutside = () => {
      onCollapse()
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [expanded, onCollapse])

  return (
    <>
      <div
        className={`absolute flex flex-col items-center justify-center bg-orange-700/90 text-white font-bold shadow-lg select-none z-20 transition-all duration-300 ${expanded ? 'cursor-default' : 'cursor-pointer'} ${expanded ? 'ring-4 ring-orange-300' : ''}`}
        style={{
          left: `${x}vw`,
          top: `${y}vh`,
          width: expanded ? 340 : 96,
          height: expanded ? 340 : 96,
          borderRadius: '9999px',
          transform: 'translate(-50%, -50%) scale(1)',
          transition: 'box-shadow 0.2s, width 0.3s, height 0.3s',
          overflow: expanded ? 'visible' : 'hidden',
        }}
        onClick={handleClick}
        tabIndex={0}
        aria-label={headline || 'Bubble'}
      >
        {expanded ? (
          <div className="w-full h-full flex flex-col justify-center items-center p-6 gap-2 text-base font-normal bg-white text-black rounded-full border-2 border-orange-400 shadow-xl text-center">
            {name && <div className="w-full">{name}</div>}
            {headline && <div className="w-full">{headline}</div>}
            {lightning && <div className="w-full">{lightning}</div>}
            {idea && <div className="w-full">{idea}</div>}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPayment(true)
              }}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2"
            >
              <span>Vote with ⚡</span>
              <span className="text-sm">({votes} votes)</span>
            </button>
          </div>
        ) : (
          <>
            <span
              className="text-center px-2 break-words"
              style={{
                fontSize:
                  headline.length < 18
                    ? '1.25rem'
                    : headline.length < 32
                    ? '1rem'
                    : headline.length < 48
                    ? '0.85rem'
                    : '0.7rem',
                lineHeight: 1.1,
                wordBreak: 'break-word',
                display: 'block',
                width: '100%',
                maxHeight: '60%',
                overflow: 'hidden',
              }}
            >
              {headline}
            </span>
            <span className="absolute left-1/2 bottom-2 transform -translate-x-1/2 text-xs font-bold" style={{color: '#FFD600'}}>
              {votes}
            </span>
          </>
        )}
      </div>
      {showPayment && (
        <LightningPayment
          ideaId={id}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  )
}

export default function Home() {
  const [formOpen, setFormOpen] = useState(false)
  const [bubbles, setBubbles] = useState<BubbleData[]>([])
  const [expandedId, setExpandedId] = useState<number | string | null>(null)
  const [loading, setLoading] = useState(true)
  const realTimeReady = useRef(false)

  // Fetch ideas from Supabase
  const fetchIdeas = async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
    if (error) return
    setBubbles(
      (data || []).map((idea) => {
        const speed = 0.125 + Math.random() * 0.125
        const angle = Math.random() * 2 * Math.PI
        return {
          id: idea.id,
          name: idea.name || '',
          headline: idea.headline || idea.title || '',
          lightning: idea.lightning || '',
          idea: idea.idea || idea.description || '',
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          paused: false,
          votes: idea.votes || 0,
        }
      })
    )
    setLoading(false)
    realTimeReady.current = true
  }

  useEffect(() => {
    fetchIdeas()
    // Real-time updates
    const channel = supabase
      .channel('ideas_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, (payload) => {
        if (!realTimeReady.current) return // Ignore events until after fetch
        if (payload.eventType === 'INSERT') {
          const idea = payload.new
          const speed = 0.125 + Math.random() * 0.125
          const angle = Math.random() * 2 * Math.PI
          setBubbles(bs => [
            ...bs,
            {
              id: idea.id,
              name: idea.name || '',
              headline: idea.headline || idea.title || '',
              lightning: idea.lightning || '',
              idea: idea.idea || idea.description || '',
              x: Math.random() * 80 + 10,
              y: Math.random() * 60 + 10,
              dx: Math.cos(angle) * speed,
              dy: Math.sin(angle) * speed,
              paused: false,
              votes: idea.votes || 0,
            },
          ])
        } else if (payload.eventType === 'UPDATE') {
          const idea = payload.new
          setBubbles(bs => bs.map(b => b.id === idea.id ? { ...b, votes: idea.votes || 0 } : b))
        } else if (payload.eventType === 'DELETE') {
          const idea = payload.old
          setBubbles(bs => bs.filter(b => b.id !== idea.id))
        }
      })
      .subscribe()
    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Add new bubble on submit (insert into Supabase)
  const handleAddIdea = async (data: { name: string; headline: string; lightning: string; idea: string }) => {
    const { data: insertData, error } = await supabase
      .from('ideas')
      .insert([
        {
          name: data.name,
          title: data.headline,
          headline: data.headline,
          lightning: data.lightning,
          idea: data.idea,
          description: data.idea,
          votes: 0,
        },
      ])
      .select()
      .single()
    if (error || !insertData) return
    setFormOpen(false)
    fetchIdeas()
  }

  // Update bubble position
  const handleMove = (id: number, x: number, y: number, dx: number, dy: number) => {
    setBubbles(bs =>
      bs.map(b => (b.id === id ? { ...b, x, y, dx, dy } : b))
    )
  }

  // Expand a bubble (pause it)
  const handleExpand = (id: number) => {
    setBubbles(bs => bs.map(b => (b.id === id ? { ...b, paused: true } : { ...b, paused: false })))
    setExpandedId(id)
  }
  // Collapse all bubbles (resume all)
  const handleCollapse = () => {
    setBubbles(bs => bs.map(b => ({ ...b, paused: false })))
    setExpandedId(null)
  }

  // SVG lines between bubbles
  const lines = []
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      lines.push(
        <line
          key={`line-${bubbles[i].id}-${bubbles[j].id}`}
          x1={`${bubbles[i].x}vw`}
          y1={`${bubbles[i].y}vh`}
          x2={`${bubbles[j].x}vw`}
          y2={`${bubbles[j].y}vh`}
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.5"
        />
      )
    }
  }

  return (
    <>
      <main className="relative min-h-screen bg-black overflow-hidden">
        {/* Title and Home Link */}
        <div className="w-full flex flex-col items-center justify-center pt-8 z-30 relative">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            What can we{' '}
            <Link href="/" className="text-orange-400 underline hover:text-orange-300 transition font-bold">Do4BTC</Link>
            ?
          </h1>
        </div>
        {/* SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh' }}>
          {lines}
        </svg>
        {/* Bubbles */}
        {bubbles.map(bubble => (
          <Bubble
            key={bubble.id}
            {...bubble}
            expanded={expandedId === bubble.id}
            onMove={handleMove}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
          />
        ))}
        {/* Floating Button */}
        {!formOpen && (
          <button
            className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
            onClick={() => setFormOpen(true)}
            aria-label="Open Submit Idea Form"
          >
            Click Me
          </button>
        )}
        {/* Dropdown Form */}
        {formOpen && (
          <div
            className="fixed inset-0 z-30 flex items-end justify-center transition-all duration-300 pointer-events-auto bg-black/40"
            aria-modal="true"
            role="dialog"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="w-full max-w-md mb-8 rounded-xl bg-black/90 p-8 shadow-lg flex flex-col gap-4 transform transition-all duration-300 translate-y-0 opacity-100 relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close form"
              >
                ×
              </button>
              <IdeaForm onSubmit={handleAddIdea} />
            </div>
          </div>
        )}
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-5">
            <circle cx="300" cy="300" r="290" fill="#f7931a" />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" alignmentBaseline="middle" fill="white" fontSize="320" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif">₿</text>
          </svg>
        </div>
      </main>
    </>
  )
} 