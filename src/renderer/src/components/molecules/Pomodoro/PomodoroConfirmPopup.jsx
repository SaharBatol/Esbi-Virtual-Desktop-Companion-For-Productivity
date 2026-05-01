const PomodoroConfirmPopup = ({ handleEndSession, setShowConfirmEnd }) => {
  return (
    <div className="confirm-overlay">
      <div className="exit-dialog">
        <h1>End Session?</h1>
        <p>Are you sure you want to end this session?</p>
        <div className="confirm-buttons">
          <button className="button-style" onClick={handleEndSession}>
            Yes
          </button>
          <button className="button-style" onClick={() => setShowConfirmEnd(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default PomodoroConfirmPopup
