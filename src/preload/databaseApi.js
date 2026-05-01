import { ipcRenderer } from 'electron'

export function createGoal(name) {
  return ipcRenderer.invoke('create-goal', name)
}

export function getGoals() {
  return ipcRenderer.invoke('get-goals')
}

export function deleteGoal(goalId) {
  return ipcRenderer.invoke('delete-goal', goalId)
}

export function createTask(goalId, name) {
  return ipcRenderer.invoke('create-task', goalId, name)
}

export function getTasks(goalId) {
  return ipcRenderer.invoke('get-tasks', goalId)
}

export function updateTask(taskId, updatedFields) {
  return ipcRenderer.invoke('update-task', taskId, updatedFields)
}

export function deleteTask(taskId) {
  return ipcRenderer.invoke('delete-task', taskId)
}

export function getTaskStats() {
  return ipcRenderer.invoke('get-task-stats')
}

export function getStreak() {
  return ipcRenderer.invoke('get-streak')
}

export function updateStreak() {
  return ipcRenderer.invoke('update-streak')
}

export function getSessions() {
  return ipcRenderer.invoke('get-sessions')
}

export function addSession(name, focusDuration, breakDuration, numberOfSessions) {
  return ipcRenderer.invoke('add-session', name, focusDuration, breakDuration, numberOfSessions)
}
