const TaskToEdit = ({
  taskToEdit,
  taskIndexToEdit,
  setTaskIndexToEdit,
  setTaskToEdit,
  setTemporaryTasks,
  task
}) => {
  const handleCancel = () => {
    setTaskToEdit('')
    setTaskIndexToEdit(null)
  }

  const handleConfirm = () => {
    setTemporaryTasks((tasks) =>
      tasks.map((task, index) => {
        return index === taskIndexToEdit
          ? { ...task, name: taskToEdit, is_completed: !!task.is_completed, has_been_edited: true }
          : { ...task, is_completed: !!task.is_completed }
      })
    )
    setTaskToEdit('')
    setTaskIndexToEdit(null)
  }

  return (
    <div key={task.id}>
      <input
        className="input-field"
        type="text"
        value={taskToEdit}
        onChange={(e) => setTaskToEdit(e.target.value)}
      />
      <button className="button-style" onClick={handleConfirm}>
        Confirm Edit
      </button>
      <button className="button-style" onClick={handleCancel}>
        Cancel Edit
      </button>
    </div>
  )
}

export default TaskToEdit
