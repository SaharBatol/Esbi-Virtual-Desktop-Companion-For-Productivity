import { useState } from 'react'
import { getDefaultSessionSettings } from '../../utils/utils'
import NewStudySessionInput from '../atoms/NewStudySessionInput'

const NewStudySession = ({ setshowNewSettingPopup, setSelectedSession, setSessionSettings }) => {
  const [newSessionSettings, setNewSessionSettings] = useState(getDefaultSessionSettings())
  const handleSaveSessionSettings = () => {
    window.databaseAPI
      .addSession(
        newSessionSettings.name,
        newSessionSettings.timerDuration,
        newSessionSettings.breakDuration,
        newSessionSettings.numberOfSessions
      )
      .then((sessionFromDb) => {
        setSessionSettings((currentSettings) => [...currentSettings, sessionFromDb])
        setSelectedSession(sessionFromDb)
        setshowNewSettingPopup(false)
      })
  }

  const handleClosePopup = () => {
    setshowNewSettingPopup(false)
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="relative">
          <h2 className="tasks-title">Custom Session</h2>
          <button className="close-button  popup-close-absolute" onClick={handleClosePopup}>
            X
          </button>
        </div>
        <div className="new-setting-form">
          <NewStudySessionInput
            labelName="Session Name:"
            inputType="text"
            placeholder="Session Name"
            newSessionSettings={newSessionSettings}
            setNewSessionSettings={setNewSessionSettings}
            inputValue="name"
          />

          <NewStudySessionInput
            labelName="Timer Duration:"
            placeholder="Enter Timer Duration in Minutes"
            newSessionSettings={newSessionSettings}
            setNewSessionSettings={setNewSessionSettings}
            inputValue="timerDuration"
          />

          <NewStudySessionInput
            labelName="Break Duration:"
            placeholder="Enter Break Duration in Minutes"
            newSessionSettings={newSessionSettings}
            setNewSessionSettings={setNewSessionSettings}
            inputValue="breakDuration"
          />

          <NewStudySessionInput
            labelName="Number of Cycles:"
            placeholder="Enter Number of Cycles"
            newSessionSettings={newSessionSettings}
            setNewSessionSettings={setNewSessionSettings}
            inputValue="numberOfSessions"
          />
          <button className="button-style" onClick={handleSaveSessionSettings}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewStudySession
