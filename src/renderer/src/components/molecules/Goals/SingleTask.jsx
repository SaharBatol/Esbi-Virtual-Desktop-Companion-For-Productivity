const SingleTask = ({ task, index, setTaskIndexToEdit, setTaskToEdit, setTemporaryTasks }) => {
  const handleEdit = (index, taskName) => {
    setTaskToEdit(taskName)
    setTaskIndexToEdit(index)
  }

  const handleDelete = (indexToDelete) => {
    setTemporaryTasks((tasks) =>
      tasks.map((task, index) => {
        if (index === indexToDelete) {
          return { ...task, to_be_deleted: true }
        }
        return { ...task }
      })
    )
  }

  const handleToggleCompleted = (indexToToggle) => {
    setTemporaryTasks((tasks) =>
      tasks.map((task, index) => {
        if (index === indexToToggle) {
          return { ...task, is_completed: !task.is_completed, has_been_edited: true }
        }
        return task
      })
    )
  }

  return (
    <div className="mb-lg" key={task.id}>
      <div className="mb-sm">
        <input
          className="mr-sm"
          onChange={() => handleToggleCompleted(index)}
          type="checkbox"
          checked={task.is_completed}
        />
        <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
          {task.name}
        </span>
      </div>
      <div>
        <button className="button-style" onClick={() => handleDelete(index)}>
          Delete
        </button>
        <button className="button-style" onClick={() => handleEdit(index, task.name)}>
          Edit
        </button>
      </div>
    </div>
  )
}

export default SingleTask
