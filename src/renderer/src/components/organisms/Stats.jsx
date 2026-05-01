import { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import StreakCount from '../atoms/StreakCount'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function fillMissingDays(rows) {
  const map = Object.fromEntries(rows.map((r) => [r.day, r.completed_count]))
  const result = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const day = date.toISOString().split('T')[0]
    const dayName = DAY_NAMES[date.getDay()]
    result.push({ day, dayName, completed_count: map[day] ?? 0 })
  }
  return result
}

const Stats = () => {
  const [taskStats, setTaskStats] = useState([])

  useEffect(() => {
    window.databaseAPI.getTaskStats().then((stats) => {
      setTaskStats(fillMissingDays(stats))
    })
  }, [])

  const days = taskStats.map((d) => d.dayName)
  const counts = taskStats.map((d) => d.completed_count)

  return (
    <>
      <h1 className="mb-md" style={{ textAlign: 'center' }}>
        Study Stats
      </h1>
      <div className="flex-container flex-center">
        <div className="flex-container flex-center self-start" style={{ width: '30%' }}>
          <StreakCount />
        </div>
        <div style={{ width: '70%' }}>
          <BarChart
            xAxis={[
              {
                id: 'barCategories',
                data: days,
                height: 80,
                categoryGapRatio: 0.2,
                label: 'Days',
                labelStyle: {
                  fontSize: 12,
                  fill: '#888',
                  fontWeight: 'bold'
                },
                tickLabelStyle: {
                  fontSize: 10,
                  fill: '#aaa',
                  angle: -45,
                  textAnchor: 'end',
                  dominantBaseline: 'auto'
                }
              }
            ]}
            yAxis={[
              {
                label: 'Tasks Completed',
                labelStyle: {
                  fontSize: 12,
                  fill: '#888',
                  fontWeight: 'bold'
                },
                disableTicks: true,
                width: 60,
                max: Math.max(...counts, 1)
              }
            ]}
            series={[
              {
                data: counts
              }
            ]}
            height={200}
            margin={{ bottom: 40 }}
            axisHighlight={{ x: 'none', y: 'none' }}
            slotProps={{ tooltip: { trigger: 'none' } }}
          />
        </div>
      </div>
    </>
  )
}

export default Stats
