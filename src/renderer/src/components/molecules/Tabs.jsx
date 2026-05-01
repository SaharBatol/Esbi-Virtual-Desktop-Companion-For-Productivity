import { IoTimerOutline } from 'react-icons/io5'
import { TbProgressCheck } from 'react-icons/tb'
import { FaChartBar } from 'react-icons/fa'
import { NavLink } from 'react-router'
import Tooltip from '@mui/material/Tooltip'

const Tabs = ({ isHidden }) => {
  const tabs = [
    { to: '/pomodoro', Icon: IoTimerOutline, label: 'Pomodoro Timer' },
    { to: '/streaks', Icon: TbProgressCheck, label: 'Streaks' },
    { to: '/stats', Icon: FaChartBar, label: 'Stats' }
  ]

  return (
    <div id="charBox">
      <div className={`tabs ${isHidden ? 'tabs-hidden' : ''}`}>
        {tabs.map(({ to, Icon, label }) => (
          <Tooltip title={label}>
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}
              style={{ color: 'inherit', top: '5px' }}
            >
              <Icon size={36} />
            </NavLink>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default Tabs
