import { useEffect, useState } from 'react'
import Tabs from './components/molecules/Tabs'
import ExitPopup from './components/molecules/ExitPopup'
import { Route, Routes, useLocation } from 'react-router'
import Stats from './components/organisms/Stats'
import LandingPage from './components/organisms/LandingPage'
import StudySessionHomepage from './components/organisms/StudySessionHomepage'
import AvatarAnimations from './components/atoms/AvatarAnimations'
import Navigation from './components/molecules/Navigation'
import Goals from './components/organisms/Goals'
import './assets/index.css'

function App() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [userNameFromLocalStorage, setUserNameFromLocalStorage] = useState('')
  const [animationState, setAnimationState] = useState('idle')
  const [isAvatarVisible, setIsAvatarVisible] = useState(true)

  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    window.databaseAPI.updateStreak()
    tryGetUserName()
  }, [])

  const tryGetUserName = () => {
    const getUserNameFromLocalStorage = localStorage.getItem('username')

    if (getUserNameFromLocalStorage) {
      setUserNameFromLocalStorage(getUserNameFromLocalStorage)
    }
  }

  return (
    <>
      <div id="draggableArea"></div>
      <div id="app">
        <AvatarAnimations animationState={animationState} isAvatarVisible={isAvatarVisible} />
        <Tabs isHidden={isLandingPage} />
        <div id="box">
          <div id="collapseDiv">
            <Navigation
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              setIsAvatarVisible={setIsAvatarVisible}
              setAnimationState={setAnimationState}
              setIsExiting={setIsExiting}
            />
            {isExiting && (
              <ExitPopup
                userNameFromLocalStorage={userNameFromLocalStorage}
                setIsExiting={setIsExiting}
                setAnimationState={setAnimationState}
              />
            )}

            <span className={(isExpanded ? 'collapsed-mode' : '') + ' collapsed-transition'}>
              <Routes>
                <>
                  <Route
                    path="/"
                    element={
                      <LandingPage
                        userNameFromLocalStorage={userNameFromLocalStorage}
                        setUserNameFromLocalStorage={setUserNameFromLocalStorage}
                      />
                    }
                  />
                  <Route path="/streaks" element={<Goals />} />
                  <Route path="/stats" element={<Stats />} />
                </>
                {/* )} */}
                <Route
                  path="/pomodoro"
                  element={<StudySessionHomepage setAnimationState={setAnimationState} />}
                />
              </Routes>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
