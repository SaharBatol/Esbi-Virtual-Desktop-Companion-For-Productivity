import { useNavigate } from 'react-router'
import { TfiArrowCircleDown } from 'react-icons/tfi'
import { IoReturnDownBack } from 'react-icons/io5'
import { IoExitOutline } from 'react-icons/io5'
import { Tooltip } from '@mui/material'

const Navigation = ({
  isExpanded,
  setIsExpanded,
  setIsAvatarVisible,
  setAnimationState,
  setIsExiting
}) => {
  const staggeredFunctionCalling = (funcOne, timeout) => {
    return new Promise((funcTwo) => {
      funcOne()

      setTimeout(() => {
        funcTwo()
      }, timeout)
    })
  }

  const handleCollapseToggle = () => {
    const func = isExpanded ? handleWindowToggle : handleAvatarToggle
    const timeout = isExpanded ? 1000 : 200

    staggeredFunctionCalling(func, timeout).then(() => {
      if (isExpanded) {
        handleAvatarToggle()
      } else {
        handleWindowToggle()
      }
    })
  }

  const handleAvatarToggle = () => {
    setIsAvatarVisible((currVal) => {
      return !currVal
    })
  }
  const handleWindowToggle = () => {
    window.windowControls.toggleCollapse()
    setIsExpanded((currVal) => {
      return !currVal
    })
  }

  const navigate = useNavigate()

  return (
    <div className="navigation-buttons-container">
      <Tooltip title="Toggle Window" placement="bottom">
        <button
          id="collapseBtn"
          className={isExpanded ? 'expanded' : ''}
          onClick={handleCollapseToggle}
        >
          <TfiArrowCircleDown size={40} className="collapseArrow" />
        </button>
      </Tooltip>
      {isExpanded ? <h2 className="text-center">Esbi: Productivity Companion</h2> : <></>}
      <div id="right-buttons">
        <Tooltip title="Back" placement="bottom">
          <button onClick={() => navigate('/')} className="navigation-button">
            <IoReturnDownBack size={40} />
          </button>
        </Tooltip>
        <Tooltip title="Exit" placement="bottom">
          <button
            onClick={() => {
              setAnimationState('wave')
              setIsExiting(true)
            }}
            className="navigation-button"
          >
            <IoExitOutline size={40} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default Navigation
