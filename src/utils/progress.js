const KEY = 'knee-routine-progress'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { date: todayStr(), completed: [] }
    const parsed = JSON.parse(raw)
    if (parsed.date !== todayStr()) return { date: todayStr(), completed: [] }
    return parsed
  } catch {
    return { date: todayStr(), completed: [] }
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable — progress just won't persist
  }
}

export function getCompleted() {
  return read().completed
}

export function markComplete(exerciseId) {
  const state = read()
  if (!state.completed.includes(exerciseId)) {
    state.completed.push(exerciseId)
    write(state)
  }
  return state.completed
}

export function isComplete(exerciseId) {
  return read().completed.includes(exerciseId)
}
