import { useEffect, useRef, useState } from 'react'
import Quotes from '../molecules/Quotes'
import PomodoroConfirmPopup from '../molecules/Pomodoro/PomodoroConfirmPopup'
import PomodoroProgressBar from '../molecules/Pomodoro/PomodoroProgressBar'
import PomodoroSessionComplete from '../molecules/Pomodoro/PomodoroSessionComplete'
import '../../assets/index.css'

const Pomodoro = ({ selectedSession, setSelectedSession, setAnimationState }) => {
  const workSeconds = selectedSession.focus_duration_minutes * 60
  const breakSeconds = selectedSession.break_duration_minutes * 60

  const [workDuration, setWorkDuration] = useState(workSeconds)
  const [breakDuration, setBreakDuration] = useState(breakSeconds)
  const [time, setTime] = useState(workSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work')
  const [pomodoroCount, setPomodoroCount] = useState(1)
  const [isCycleComplete, setIsCycleComplete] = useState(false)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)

  const intervalRef = useRef(null)

  useEffect(() => {
    if (!selectedSession) return

    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [selectedSession])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          handleTimerEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const handleTimerEnd = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)

    const isWorkFinished = mode === 'work'

    if (window.electron?.notify) {
      window.electron.notify(isWorkFinished ? 'Work session complete!' : 'Break over!')
    }

    if (window.electron?.flashWindow) {
      window.electron.flashWindow()
    }

    if (isWorkFinished) {
      setMode('break')
      setTime(breakDuration)

      setAnimationState('break')

      setTimeout(() => setIsRunning(true), 100)
    } else {
      setPomodoroCount((prev) => {
        const nextCount = prev + 1

        if (nextCount > selectedSession.number_of_sessions) {
          setIsCycleComplete(true)

          setAnimationState('cheer')

          if (window.electron?.notify) {
            window.electron.notify('Pomodoro session complete!')
          }

          if (window.electron?.flashWindow) {
            window.electron.flashWindow()
          }

          return prev
        }

        setMode('work')
        setTime(workDuration)

        setAnimationState('idle')

        setTimeout(() => setIsRunning(true), 100)

        return nextCount
      })
    }
  }

  const start = () => {
    if (!intervalRef.current) {
      setIsRunning(true)
    }
  }

  const pause = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
  }

  const handleEndSession = () => {
    pause()
    setSelectedSession({})
    setAnimationState('idle')
  }

  if (!selectedSession) {
    return null
  }

  return (
    <div id="pomodoroContainer">
      {isCycleComplete ? (
        <PomodoroSessionComplete handleEndSession={handleEndSession} />
      ) : (
        <>
          <div className="pomodoro-header">
            <h1 className="session-count">
              Pomodoro {pomodoroCount}/{selectedSession.number_of_sessions}
            </h1>
          </div>

          <PomodoroProgressBar time={time} workSeconds={workSeconds} mode={mode} />

          <Quotes mode={mode} isRunning={isRunning} />

          <div className="controls">
            <button className="button-style" onClick={start}>
              Start
            </button>
            <button className="button-style" onClick={pause}>
              Pause
            </button>
            <button className="button-style" onClick={() => setShowConfirmEnd(true)}>
              End Session
            </button>
          </div>

          {showConfirmEnd && (
            <PomodoroConfirmPopup
              handleEndSession={handleEndSession}
              setShowConfirmEnd={setShowConfirmEnd}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Pomodoro
