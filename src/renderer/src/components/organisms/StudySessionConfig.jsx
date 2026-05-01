import { useState } from 'react'
import NewStudySession from './NewStudySession'

const StudySessionConfig = ({ sessionSettings, setSelectedSession, setSessionSettings }) => {
  const [showNewSettingPopup, setshowNewSettingPopup] = useState(false)
  return (
    <div className="study-session-container">
      <h1>Configure your study session</h1>
      <div className="study-buttons-flex-container">
        <div className="study-session-flex-inner">
          {sessionSettings.map((session) => {
            return (
              <button
                key={session.id}
                className="study-config-buttons"
                onClick={() => setSelectedSession(session)}
              >
                {session.name}
              </button>
            )
          })}

          <button
            className="study-config-buttons"
            onClick={() => {
              setshowNewSettingPopup(true)
            }}
          >
            Add Custom
          </button>
        </div>
      </div>
      {showNewSettingPopup && (
        <NewStudySession
          setshowNewSettingPopup={setshowNewSettingPopup}
          setSelectedSession={setSelectedSession}
          setSessionSettings={setSessionSettings}
        />
      )}
    </div>
  )
}

export default StudySessionConfig
