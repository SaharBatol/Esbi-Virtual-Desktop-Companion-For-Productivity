import { useState, useEffect } from 'react'

const StreakCount = () => {
  const [streak, setStreak] = useState(null)

  useEffect(() => {
    window.databaseAPI.getStreak().then((dbStreak) => setStreak(dbStreak))
  }, [])

  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        border: '2px solid #7ce5e3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold'
      }}
    >
      <p className="mb-sm">{streak}</p>
      <p>Day streak!</p>
    </div>
  )
}

export default StreakCount
