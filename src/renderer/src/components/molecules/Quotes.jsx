import { useEffect, useRef, useState } from 'react'

const workQuotes = [
  "Stay focused. You're building momentum.",
  'One task at a time.',
  'Deep work creates real progress.',
  'Small steps. Big results.',
  'Discipline beats motivation.',
  "You're closer than you think.",
  'Lock in. This is your time.'
]

const Quotes = ({ mode, isRunning }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (mode !== 'work' || !isRunning) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % workQuotes.length)
    }, 10000)

    return () => clearInterval(intervalRef.current)
  }, [mode, isRunning])

  useEffect(() => {
    if (mode === 'work') {
      setCurrentQuoteIndex(0)
    }
  }, [mode])

  return (
    <div className="quote-section">
      {mode === 'work' ? (
        <p key={currentQuoteIndex} className="quote-text">
          {workQuotes[currentQuoteIndex]}
        </p>
      ) : (
        <p className="break-text">Take a break. You've earned it!</p>
      )}
    </div>
  )
}

export default Quotes
