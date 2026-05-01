import { useEffect, useState } from 'react'
import SingleTask from '../molecules/Goals/SingleTask'
import TaskToEdit from '../molecules/Goals/TaskToEdit'

const TasksList = ({ setGoals, tasks, setTasks, selectedGoal, setSelectedGoal }) => {
  const [temporaryTasks, setTemporaryTasks] = useState([])
  const [taskToEdit, setTaskToEdit] = useState('')
  const [taskToAdd, setTaskToAdd] = useState('')
  const [taskIndexToEdit, setTaskIndexToEdit] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setTemporaryTasks(() =>
      tasks.map((task) => ({
        ...task,
        is_completed: !!task.is_completed
      }))
    )
  }, [tasks])

  const handleAddNewTask = () => {
    const trimmedTaskNameLength = taskToAdd.trim().length

    if (trimmedTaskNameLength === 0) {
      setError('This field is required')
      return
    }
    if (taskToAdd.length <= 2) {
      setError('Name not long enough')
      return
    }
    setError('')
    setTemporaryTasks((tasks) => [
      ...tasks,
      {
        id: Date.now(),
        goal_id: selectedGoal.id,
        name: taskToAdd,
        is_completed: false,
        created_at: new Date().toISOString(),
        completed_at: null,
        has_been_added: true
      }
    ])
    setTaskToAdd('')
  }

  const handleSaveTasks = () => {
    let completedTasks = 0
    let totalTasks = 0
    temporaryTasks.map((task) => {
      if (!task.hasOwnProperty('to_be_deleted')) {
        totalTasks++
        if (task.is_completed) {
          completedTasks++
        }
      }

      setGoals((goals) => {
        return goals.map((goal) => {
          if (goal.id == selectedGoal.id) {
            return { ...goal, completed_tasks: completedTasks, total_tasks: totalTasks }
          }
          return goal
        })
      })
      if (task.has_been_added) {
        window.databaseAPI.createTask(task.goal_id, task.name)
      }
      if (task.has_been_edited) {
        window.databaseAPI.updateTask(task.id, {
          name: task.name,
          is_completed: task.is_completed
        })
      }
      if (task.to_be_deleted) {
        window.databaseAPI.deleteTask(task.id)
      }
    })

    setTasks(
      temporaryTasks.reduce((updatedTasks, task) => {
        if (!task.hasOwnProperty('to_be_deleted')) {
          updatedTasks.push({
            id: task.id,
            name: task.name,
            is_completed: task.is_completed
          })
        }
        return updatedTasks
      }, [])
    )

    setSelectedGoal({})
  }

  const handleDiscardTasks = () => {
    setTemporaryTasks([...tasks])
    setTaskToAdd('')
  }

  const handleClosePopup = () => {
    setSelectedGoal({})
    setTasks([])
  }

  return (
    <div className="new-tasks-container">
      <div className="relative">
        <h2 className="tasks-title">{selectedGoal.name}</h2>
        <button className="close-button popup-close-absolute" onClick={handleClosePopup}>
          X
        </button>
      </div>
      {temporaryTasks.map((task, index) => {
        if (task.to_be_deleted) {
          return null
        }

        return taskIndexToEdit !== index ? (
          <SingleTask
            task={task}
            index={index}
            setTaskIndexToEdit={setTaskIndexToEdit}
            setTaskToEdit={setTaskToEdit}
            setTemporaryTasks={setTemporaryTasks}
          />
        ) : (
          <TaskToEdit
            taskToEdit={taskToEdit}
            taskIndexToEdit={taskIndexToEdit}
            setTaskIndexToEdit={setTaskIndexToEdit}
            setTaskToEdit={setTaskToEdit}
            setTemporaryTasks={setTemporaryTasks}
            task={task}
          />
        )
      })}
      <div className="flex-container flex-center">
        <button className="button-style mr-sm" onClick={handleAddNewTask}>
          +
        </button>
        <input
          className="input-field"
          type="text"
          value={taskToAdd}
          onChange={(e) => {
            setTaskToAdd(e.target.value)
            if (error) setError('')
          }}
          placeholder="New Task"
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="flex-container flex-center">
        <button className="button-style mr-sm" onClick={handleDiscardTasks}>
          Discard
        </button>
        <button className="button-style" onClick={handleSaveTasks}>
          Save
        </button>
      </div>
    </div>
  )
}

export default TasksList
