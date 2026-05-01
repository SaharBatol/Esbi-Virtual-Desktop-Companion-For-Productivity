const PomodoroSessionComplete = ({ handleEndSession }) => {
  return (
    <div className="completion-screen">
      <h1 className="heading">Session Complete!</h1>
      <button className="button-style" onClick={handleEndSession}>
        Start New Session
      </button>
    </div>
  )
}

export default PomodoroSessionComplete
