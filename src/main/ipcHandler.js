import { ipcMain } from 'electron'

export function setUpIpcHandlers(db) {
  ipcMain.handle('create-goal', (event, nameToAdd) => {
    const stmt = db.prepare(`
    INSERT INTO goals (name)
    VALUES (?)
    RETURNING *
  `)

    const result = stmt.get(nameToAdd)
    return result
  })

  ipcMain.handle('get-goals', () => {
    return db
      .prepare(
        `SELECT
          g.*,
          COUNT(t.id) AS total_tasks,
          COALESCE(SUM(t.is_completed), 0) AS completed_tasks
        FROM goals g
        LEFT JOIN tasks t ON t.goal_id = g.id
        GROUP BY g.id`
      )
      .all()
  })

  ipcMain.handle('delete-goal', (event, goalId) => {
    const stmt = db.prepare('DELETE FROM goals WHERE id = ?')
    const result = stmt.run(goalId)
    return result.changes
  })

  ipcMain.handle('get-task-stats', () => {
    return db
      .prepare(
        `SELECT 
        DATE(completed_at) as day,
        strftime('%w', completed_at) as day_num, -- 0=Sunday, 6=Saturday
        COUNT(*) as completed_count
      FROM tasks
      WHERE 
        completed_at IS NOT NULL
        AND completed_at >= DATE('now', '-6 days')
      GROUP BY DATE(completed_at)
      ORDER BY day ASC`
      )
      .all()
  })

  ipcMain.handle('create-task', (event, goalId, name) => {
    db.prepare(
      `INSERT INTO tasks (goal_id, name)
      VALUES (?, ?)`
    ).run(goalId, name)
  })

  ipcMain.handle('get-tasks', (event, goalId) => {
    return db.prepare('SELECT * FROM tasks WHERE goal_id = ?').all(goalId)
  })

  ipcMain.handle('update-task', (event, taskId, fields) => {
    const updates = []
    const values = []

    if (fields.name !== undefined) {
      updates.push('name = ?')
      values.push(fields.name)
    }
    if (fields.is_completed !== undefined) {
      updates.push('is_completed = ?')
      values.push(fields.is_completed ? 1 : 0)
      if (fields.is_completed) {
        updates.push('completed_at = ?')
        values.push(new Date().toISOString())
      } else {
        updates.push('completed_at = ?')
        values.push(null)
      }
    }

    if (updates.length === 0) return

    const stmt = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`)
    stmt.run(...values, taskId)
  })

  ipcMain.handle('delete-task', (event, taskId) => {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?')
    const result = stmt.run(taskId)
    return result.changes
  })

  ipcMain.handle('get-streak', () => {
    const streak = db.prepare('SELECT current_streak FROM streak WHERE id = 1').get()

    return streak ? streak.current_streak : 0
  })

  ipcMain.handle('update-streak', (event) => {
    const streak = db.prepare('SELECT * FROM streak WHERE id = 1').get()

    const getDateOnly = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }
    const today = getDateOnly(new Date())
    const lastDate = getDateOnly(new Date(streak.last_date_logged_in))

    const oneDay = 1000 * 60 * 60 * 24
    const diffDays = Math.round((today - lastDate) / oneDay)

    let newStreak

    if (diffDays === 1) {
      newStreak = streak.current_streak + 1
    } else if (diffDays > 1) {
      newStreak = 1
    } else {
      newStreak = streak.current_streak
    }

    const todayToStore = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString()

    db.prepare('UPDATE streak SET current_streak = ?, last_date_logged_in = ? WHERE id = 1').run(
      newStreak,
      todayToStore
    )
  })

  ipcMain.handle('get-sessions', (event) => {
    return db.prepare('SELECT * FROM session_settings').all()
  })

  ipcMain.handle('add-session', (event, name, focusDuration, breakDuration, numberOfSessions) => {
    const stmt = db.prepare(`
      INSERT INTO session_settings 
      (name, focus_duration_minutes, break_duration_minutes, number_of_sessions)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `)

    return stmt.get(name, focusDuration, breakDuration, numberOfSessions)
  })
}

export function setUpDatabase(db) {
  db.exec('PRAGMA foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS streak (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      current_streak INTEGER NOT NULL,
      last_date_logged_in TEXT NOT NULL
    );

  CREATE TABLE IF NOT EXISTS session_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    focus_duration_minutes INTEGER NOT NULL,
    break_duration_minutes INTEGER NOT NULL,
    number_of_sessions INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
  `)

  const goalsCount = db.prepare('SELECT COUNT(*) AS count FROM goals').get().count

  if (goalsCount === 0) {
    const insertGoal = db.prepare('INSERT INTO goals (name, created_at) VALUES (?, ?)')
    const goalId = insertGoal.run('Learn Electron', new Date().toISOString()).lastInsertRowid

    const insertGoal2 = db.prepare('INSERT INTO goals (name, created_at) VALUES (?, ?)')
    insertGoal2.run('Learn Electron again', new Date().toISOString()).lastInsertRowid

    const insertTask = db.prepare('INSERT INTO tasks (goal_id, name, created_at) VALUES (?, ?, ?)')
    insertTask.run(goalId, 'Set up Electron app', new Date().toISOString())
    insertTask.run(goalId, 'Install better-sqlite3', new Date().toISOString())
  }

  const streakCount = db.prepare('SELECT COUNT(*) AS count FROM streak').get().count

  if (streakCount === 0) {
    db.prepare('INSERT INTO streak (current_streak, last_date_logged_in) VALUES (?, ?)').run(
      1,
      new Date().toISOString()
    )
  }

  const sessionCount = db.prepare('SELECT COUNT(*) AS count FROM session_settings').get().count

  if (sessionCount === 0) {
    const insert = db.prepare(`
    INSERT INTO session_settings 
    (name, focus_duration_minutes, break_duration_minutes, number_of_sessions)
    VALUES (?, ?, ?, ?)
  `)
    insert.run('25 / 5 Timer', 25, 5, 4)
    insert.run('30 / 10 Timer', 30, 10, 4)
    insert.run('1 / 10 Timer', 1, 10, 4)
  }
}
