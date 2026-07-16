import { exercises } from '../data/exercises.js'

// This would be the URL of your backend service.
const API_BASE_URL = '/api'

/**
 * Fetches the current progress data from the backend.
 */
export async function getProgressData() {
  try {
    const response = await fetch(`${API_BASE_URL}/progress`)
    if (!response.ok) throw new Error('Failed to fetch progress')
    return await response.json()
  } catch (error) {
    console.error('Error getting progress:', error)
    // Return a default state if the API call fails
    return { completed: [], sets: 0 }
  }
}

/**
 * Marks an exercise as complete by sending an update to the backend.
 * @param {number} exerciseId The ID of the completed exercise.
 */
export async function markComplete(exerciseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId }),
    })
    if (!response.ok) throw new Error('Failed to mark complete')
    return await response.json()
  } catch (error) {
    console.error('Error marking complete:', error)
    // On failure, you might want to return the current state or handle the error
    return getProgressData()
  }
}

/**
 * Resets the daily progress on the backend.
 */
export async function resetDailyProgress() {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/reset`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to reset progress')
    return await response.json()
  } catch (error) {
    console.error('Error resetting progress:', error)
    return getProgressData()
  }
}
