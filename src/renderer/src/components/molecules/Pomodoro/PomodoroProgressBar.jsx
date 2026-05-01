const PomodoroProgressBar = ({ mode, time, workSeconds }) => {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0')
  const seconds = String(time % 60).padStart(2, '0')
  const progress = workSeconds > 0 ? ((workSeconds - time) / workSeconds) * 100 : 0

  return (
    <div className="progress-bar">
      <div className={`progress-fill ${mode}`} style={{ width: `${Math.ceil(progress)}%` }} />
      <p className="progress-text">
        {minutes}:{seconds}
      </p>
    </div>
  )
}

export default PomodoroProgressBar
