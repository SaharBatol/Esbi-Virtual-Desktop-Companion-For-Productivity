import { useEffect, useState } from 'react'
import TasksList from '../../organisms/TasksList'

const GoalPopup = ({ setGoals, selectedGoal, setSelectedGoal }) => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (selectedGoal !== null) {
      window.databaseAPI.getTasks(selectedGoal.id).then((tasks) => {
        setTasks(tasks)
      })
    }
  }, [selectedGoal])

  return (
    <>
      {selectedGoal.id && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <TasksList
              setGoals={setGoals}
              tasks={tasks}
              setTasks={setTasks}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default GoalPopup
