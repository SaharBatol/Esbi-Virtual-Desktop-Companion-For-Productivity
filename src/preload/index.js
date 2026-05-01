import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  addSession,
  createGoal,
  createTask,
  deleteGoal,
  deleteTask,
  getGoals,
  getSessions,
  getStreak,
  getTasks,
  getTaskStats,
  updateStreak,
  updateTask
} from './databaseApi'

const windowControls = {}
const DOMContentLoaded = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      notify: (message) => ipcRenderer.send('notify', message),
      flashWindow: () => ipcRenderer.send('flash-window'),
      quitApp: () => ipcRenderer.send('app:quit'),
      ...electronAPI
    })
    contextBridge.exposeInMainWorld('windowControls', {
      toggleCollapse: () => {
        ipcRenderer.invoke('collapse')
      }
    })

    contextBridge.exposeInMainWorld('databaseAPI', {
      createGoal,
      getGoals,
      deleteGoal,
      createTask,
      getTasks,
      updateTask,
      deleteTask,
      getTaskStats,
      getStreak,
      updateStreak,
      getSessions,
      addSession
    })

    window.addEventListener('DOMContentLoaded', () => {
      ipcRenderer.on('update-height', (_event, height) => {
        document.getElementById('app').style.height = height
      })
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.windowControls = windowControls
  window.DOMContentLoaded = DOMContentLoaded
}
