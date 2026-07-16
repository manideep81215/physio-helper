import { exercises } from '../data/exercises.js'

const PROGRESS_KEY = 'knee-routine-progress-v2'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function getProgress() {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return { date: getToday(), completed: [], sets: 0 }
    const progress = JSON.parse(stored)
    // if it's a new day, reset daily progress but keep sets
    if (progress.date !== getToday()) {
      return { date: getToday(), completed: [], sets: progress.sets || 0 }
    }
    return progress
  } catch {
    return { date: getToday(), completed: [], sets: 0 }
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

export function getProgressData() {
  return getProgress()
}

export function markComplete(exerciseId) {
  const progress = getProgress()
  if (!progress.completed.includes(exerciseId)) {
    progress.completed.push(exerciseId)
    if (progress.completed.length === exercises.length) {
      progress.sets = (progress.sets || 0) + 1
    }
    saveProgress(progress)
  }
  return progress
}

export function resetDailyProgress() {
  const progress = getProgress()
  const newProgress = { ...progress, completed: [] }
  saveProgress(newProgress)
  return newProgress
}
