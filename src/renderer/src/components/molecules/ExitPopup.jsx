const ExitPopup = ({ userNameFromLocalStorage, setIsExiting, setAnimationState }) => {
  const handleDefault = () => {
    setIsExiting(false)
    setAnimationState('idle')
  }

  return (
    <div className="confirm-overlay">
      <div className="exit-dialog">
        <div className="relative">
          <h1>Goodbye {userNameFromLocalStorage}! </h1>
          <button className="close-button popup-close-absolute" onClick={handleDefault}>
            X
          </button>
        </div>
        <p className="mb-sm">Are you sure you want to leave?</p>
        <button className="button-style mr-sm" onClick={() => window.electron.quitApp()}>
          Confirm
        </button>

        <button className="button-style mr-sm" onClick={handleDefault}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ExitPopup
