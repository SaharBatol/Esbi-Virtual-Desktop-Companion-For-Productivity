import { useState } from 'react'

const NewGoalPopup = ({ setSelectedGoal, setIsOpen, setGoals }) => {
  const [goalNameToAdd, setGoalNameToAdd] = useState('')
  const [error, setError] = useState('')

  const handleSaveGoal = () => {
    const trimmedGoalNameLength = goalNameToAdd.trim().length

    if (trimmedGoalNameLength === 0) {
      setError('This field is required')
      return
    }

    if (goalNameToAdd.length <= 2) {
      setError('Name not long enough')
      return
    }

    setError('')
    window.databaseAPI.createGoal(goalNameToAdd).then((newGoal) => {
      setGoals((goals) => [...goals, newGoal])
      setSelectedGoal(newGoal)
      setIsOpen(false)
    })
  }

  const handleClosePopup = () => {
    setIsOpen(false)
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="relative">
          <h2 className="tasks-title">Enter Goal Name</h2>
          <button className="close-button popup-close-absolute" onClick={handleClosePopup}>
            X
          </button>
        </div>
        <input
          type="text"
          className="input-field"
          value={goalNameToAdd}
          onChange={(e) => {
            setGoalNameToAdd(e.target.value)
            if (error) setError('')
          }}
          placeholder="New Goal"
        />
        {error && <p className="error">{error}</p>}
        <button className="button-style" onClick={handleSaveGoal}>
          Save
        </button>
      </div>
    </div>
  )
}

export default NewGoalPopup
