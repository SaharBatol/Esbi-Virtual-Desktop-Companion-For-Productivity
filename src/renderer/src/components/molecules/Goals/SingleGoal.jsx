import { useState } from 'react'

const SingleGoal = ({ goal, setSelectedGoal, setGoals }) => {
  const [showConfirmPopup, setConfirmPopup] = useState(false)
  const progress = (goal.completed_tasks / goal.total_tasks) * 100

  const handleDeleteGoal = (e) => {
    e.stopPropagation()
    window.databaseAPI.deleteGoal(goal.id)
    setGoals((goals) => {
      const newGoals = goals.filter((eachGoal) => eachGoal.id !== goal.id)
      return newGoals
    })
  }
  const showPopup = (e) => {
    e.stopPropagation()
    setConfirmPopup(true)
  }
  return (
    <>
      <div className="goal-progress-bar" onClick={() => setSelectedGoal(goal)}>
        <div className="goal-progress-fill" style={{ width: `${progress}%` }} />
        <span className="goal-progress-text">{goal.name}</span>
        <button className="button-style goal-delete-button" onClick={(e) => showPopup(e)}>
          Delete
        </button>
      </div>
      {showConfirmPopup && (
        <div className="confirm-overlay">
          <div className="exit-dialog">
            <div className="relative">
              <h1>Delete Goal?</h1>
              <button
                className="close-button popup-close-absolute"
                onClick={() => setConfirmPopup(false)}
              >
                X
              </button>
            </div>
            <p className="mb-sm"> Are you sure you want to delete the goal?</p>
            <button className="button-style mr-sm" onClick={(e) => handleDeleteGoal(e)}>
              Confirm
            </button>
            <button className="button-style " onClick={() => setConfirmPopup(false)}>
              cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export default SingleGoal
