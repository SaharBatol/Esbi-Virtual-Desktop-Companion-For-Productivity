import { useNavigate } from 'react-router'
import { IoTimerOutline } from 'react-icons/io5'
import { TbProgressCheck } from 'react-icons/tb'
import { FaChartBar } from 'react-icons/fa'

const LoggedIn = ({ userNameFromLocalStorage }) => {
  const navigate = useNavigate()
  return (
    <div className="logged-in-container">
      <h1 className="text-spacing">Hello {userNameFromLocalStorage}!</h1>
      <h2 className="text-spacing">What would you like to do today?</h2>
      <div className="button-container">
        <button className="button-style icon-buttons" onClick={() => navigate('/pomodoro')}>
          <IoTimerOutline size={30} />
          <p className="icon-button-text">Study Session</p>
        </button>
        <button className="button-style icon-buttons" onClick={() => navigate('/streaks')}>
          <TbProgressCheck size={30} />
          <p className="icon-button-text">Goals</p>
        </button>
        <button className="button-style icon-buttons" onClick={() => navigate('/stats')}>
          <FaChartBar size={30} />
          <p className="icon-button-text">Study Statistics</p>
        </button>
      </div>
    </div>
  )
}

export default LoggedIn
