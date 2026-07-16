import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { exercises, TOTAL_ROUNDS, WORK_SECONDS } from '../data/exercises.js'
import { iconMap } from '../icons/ExerciseIcons.jsx'
import { getProgressData } from '../utils/progress.js'
import './Home.css'

export default function Home() {
  const [progress, setProgress] = useState({ completed: [], sets: 0 })

  useEffect(() => {
    async function loadProgress() {
      const data = await getProgressData()
      setProgress(data)
    }
    loadProgress()
  }, [])

  const doneCount = progress.completed.length

  return (
    <div className="home">
      <header className="home-hero">
        <p className="home-eyebrow">DAILY SET · {exercises.length} EXERCISES</p>
        <h1 className="home-title">Knee Recovery Routine</h1>
        <p className="home-sub">
          Ten holds a round, {WORK_SECONDS}s each, {TOTAL_ROUNDS} rounds per exercise.
          Work steadily — the timer keeps pace so you don't have to.
        </p>

        <div className="home-progress" role="status" aria-label={`${doneCount} of ${exercises.length} exercises completed today`}>
          <div className="home-progress-track">
            {exercises.map((ex) => (
              <span
                key={ex.id}
                className={`home-progress-dot ${progress.completed.includes(ex.id) ? 'is-done' : ''}`}
                title={ex.code}
              />
            ))}
          </div>
          <span className="home-progress-label">{doneCount} of {exercises.length} done today</span>
        </div>
      </header>

      <main className="home-grid">
        {exercises.map((ex) => {
          const Icon = iconMap[ex.icon]
          const done = progress.completed.includes(ex.id)
          return (
            <Link to={`/exercise/${ex.id}`} key={ex.id} className={`ex-card ${done ? 'is-done' : ''}`}>
              <div className="ex-card-top">
                <span className="ex-card-code">{ex.code}</span>
                {done && <span className="ex-card-check" aria-label="Completed today">✓</span>}
              </div>
              <div className="ex-card-icon">
                <Icon />
              </div>
              <h2 className="ex-card-title">{ex.title}</h2>
              <p className="ex-card-cue">{ex.cue}</p>
              <span className="ex-card-meta">{TOTAL_ROUNDS} rounds · {WORK_SECONDS}s hold</span>
            </Link>
          )
        })}
      </main>
    </div>
  )
}
