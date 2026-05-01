import { useEffect, useState } from 'react'
import Pomodoro from './Pomodoro'
import StudySessionConfig from './StudySessionConfig'

const StudySessionHomepage = ({ setAnimationState }) => {
  const [sessionSettings, setSessionSettings] = useState([])
  const [selectedSession, setSelectedSession] = useState({})

  useEffect(() => {
    window.databaseAPI.getSessions().then((sessions) => {
      setSessionSettings(sessions)
    })
  }, [])

  if (selectedSession.id) {
    return (
      <Pomodoro
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        setAnimationState={setAnimationState}
      />
    )
  }
  return (
    <StudySessionConfig
      sessionSettings={sessionSettings}
      setSessionSettings={setSessionSettings}
      setSelectedSession={setSelectedSession}
    />
  )
}

export default StudySessionHomepage
