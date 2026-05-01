import { useEffect, useState } from 'react'
import NewGoalPopup from '../molecules/Goals/NewGoalPopup'
import GoalPopup from '../molecules/Goals/GoalPopup'
import SingleGoal from '../molecules/Goals/SingleGoal'

const Goals = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [goals, setGoals] = useState([])
  const [selectedGoal, setSelectedGoal] = useState({})

  useEffect(() => {
    window.databaseAPI.getGoals().then((dbGoals) => setGoals(dbGoals))
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <h1 className="text-center mb-md">Goals</h1>
      <div id="goalContainer">
        {goals.map((goal) => (
          <SingleGoal
            key={goal.id}
            goal={goal}
            setSelectedGoal={setSelectedGoal}
            setGoals={setGoals}
          />
        ))}
        <button
          className="button-style mb-md"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Add New Goal
        </button>
        {isOpen && (
          <NewGoalPopup
            setGoals={setGoals}
            setSelectedGoal={setSelectedGoal}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
      <GoalPopup
        setGoals={setGoals}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
      />
    </div>
  )
}

export default Goals
