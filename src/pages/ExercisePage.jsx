import { useEffect, useMemo, useReducer, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getExerciseById,
  exercises,
  WORK_SECONDS,
  DEFAULT_REST_SECONDS,
  TOTAL_ROUNDS,
} from '../data/exercises.js'
import { iconMap } from '../icons/ExerciseIcons.jsx'
import { markComplete } from '../utils/progress.js'
import './ExercisePage.css'

const initialState = (restSeconds) => ({
  phase: 'idle', // idle | work | rest | done
  round: 0,
  secondsLeft: WORK_SECONDS,
  running: false,
  restSeconds,
})

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'work', round: 1, secondsLeft: WORK_SECONDS, running: true }
    case 'TICK': {
      if (!state.running) return state
      if (state.secondsLeft > 1) return { ...state, secondsLeft: state.secondsLeft - 1 }
      // this tick reaches zero -> transition phase
      if (state.phase === 'work') {
        if (state.round >= TOTAL_ROUNDS) {
          return { ...state, phase: 'done', running: false, secondsLeft: 0 }
        }
        return { ...state, phase: 'rest', secondsLeft: state.restSeconds }
      }
      if (state.phase === 'rest') {
        return { ...state, phase: 'work', round: state.round + 1, secondsLeft: WORK_SECONDS }
      }
      return state
    }
    case 'PAUSE':
      return { ...state, running: false }
    case 'RESUME':
      return { ...state, running: true }
    case 'SKIP': {
      // manually force the same transition TICK would do at zero
      if (state.phase === 'work') {
        if (state.round >= TOTAL_ROUNDS) return { ...state, phase: 'done', running: false, secondsLeft: 0 }
        return { ...state, phase: 'rest', secondsLeft: state.restSeconds }
      }
      if (state.phase === 'rest') {
        return { ...state, phase: 'work', round: state.round + 1, secondsLeft: WORK_SECONDS }
      }
      return state
    }
    case 'RESET':
      return initialState(state.restSeconds)
    case 'SET_REST':
      return { ...state, restSeconds: action.value }
    default:
      return state
  }
}

function useBeep() {
  const ctxRef = useRef(null)
  return (freq = 880, duration = 0.12, volume = 0.45) => {
    try {
      if (!ctxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        ctxRef.current = new AudioCtx()
      }
      const ctx = ctxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = freq
      osc.type = 'triangle'
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // audio unavailable — silently skip
    }
  }
}

function useAudio(src) {
  const audioRef = useRef(null);

  return () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
      }
      audioRef.current.currentTime = 0; // Corrected from audio.current
      audioRef.current.play().catch(() => {}); // Ignore play errors
    } catch (e) {
      // audio unavailable
    }
  };
}

function useWakeLock() {
  const wakeLockRef = useRef(null);

  const acquire = async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch (err) {
      // ignore
    }
  };

  const release = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        // ignore
      }
    }
  };

  useEffect(() => {
    return () => {
      release();
    };
  }, []);

  return { acquire, release };
}

export default function ExercisePage() {
  const { id } = useParams()
  const exercise = getExerciseById(id)
  const [state, dispatch] = useReducer(reducer, DEFAULT_REST_SECONDS, initialState)
  const beep = useBeep()
  const playStartSound = useAudio('/start.mp3');
  const playStopSound = useAudio('/stop.mp3');
  const playCompletedSound = useAudio('/completed.mp3');
  const prevPhaseRef = useRef(state.phase)
  const lastTickBeepRef = useRef(null)
  const restartChimeTimersRef = useRef([])

  useEffect(() => {
    if (!state.running) return
    const t = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(t)
  }, [state.running])

  const wakeLock = useWakeLock();
  useEffect(() => {
    if (state.running) {
      wakeLock.acquire();
    } else {
      wakeLock.release();
    }
  }, [state.running]);


  useEffect(() => {
    return () => {
      restartChimeTimersRef.current.forEach((timerId) => clearTimeout(timerId))
      restartChimeTimersRef.current = []
    }
  }, [])

  // sound + haptic + completion side-effects on phase change
  useEffect(() => {
    if (prevPhaseRef.current === state.phase) return
    const prev = prevPhaseRef.current
    prevPhaseRef.current = state.phase

    if (state.phase === 'work') {
      playStartSound();
      lastTickBeepRef.current = null
      if (navigator.vibrate) navigator.vibrate(80)
    } else if (state.phase === 'rest') {
      playStopSound();
      if (navigator.vibrate) navigator.vibrate([40, 40, 40])
    } else if (state.phase === 'done') {
      playCompletedSound();
      if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 160])
      if (exercise) markComplete(exercise.id) // This is now an async function
    }
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // 3-2-1 countdown ticks in the last 3 seconds of a work or rest phase
  useEffect(() => {
    if (!state.running) return
    if (state.phase !== 'work' && state.phase !== 'rest') return
    if (state.secondsLeft > 3 || state.secondsLeft < 1) return
    const tickKey = `${state.phase}-${state.round}-${state.secondsLeft}`
    if (lastTickBeepRef.current === tickKey) return
    lastTickBeepRef.current = tickKey
    const tickTones = {
      3: 740,
      2: 880,
      1: 988,
    }
    beep(tickTones[state.secondsLeft] || 660, 0.12, 0.65)
    if (navigator.vibrate) navigator.vibrate(30)
  }, [state.secondsLeft, state.running, state.phase, state.round]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentTotal = state.phase === 'rest' ? state.restSeconds : WORK_SECONDS
  const progress = state.phase === 'idle' || state.phase === 'done'
    ? 0
    : (currentTotal - state.secondsLeft) / currentTotal

  const ringColor = state.phase === 'work' ? 'var(--coral)' : state.phase === 'rest' ? 'var(--blue)' : 'var(--sage)'

  const nextIdx = useMemo(() => {
    const idx = exercises.findIndex((e) => e.id === Number(id))
    return idx >= 0 && idx < exercises.length - 1 ? exercises[idx + 1] : null
  }, [id])

  if (!exercise) {
    return (
      <div className="ex-page">
        <p>Exercise not found. <Link to="/">Back to routine</Link></p>
      </div>
    )
  }

  const Icon = iconMap[exercise.icon]
  const circumference = 2 * Math.PI * 88

  return (
    <div className="ex-page">
      <Link to="/" className="ex-back">← All exercises</Link>

      <div className="ex-page-head">
        <span className="ex-page-code">{exercise.code}</span>
        <h1 className="ex-page-title">{exercise.title}</h1>
        <p className="ex-page-detail">{exercise.detail}</p>
      </div>

      <div className="timer-wrap">
        <div className="timer-ring-box">
          <svg viewBox="0 0 200 200" className="timer-ring">
            <circle cx="100" cy="100" r="88" className="timer-ring-track" />
            <circle
              cx="100"
              cy="100"
              r="88"
              className="timer-ring-progress"
              style={{
                stroke: ringColor,
                strokeDasharray: circumference,
                strokeDashoffset: circumference * (1 - progress),
              }}
            />
          </svg>
          <div className="timer-center">
            {state.phase === 'idle' && (
              <div className="timer-icon-idle"><Icon /></div>
            )}
            {state.phase !== 'idle' && state.phase !== 'done' && (
              <>
                <span className="timer-phase-label" style={{ color: ringColor }}>
                  {state.phase === 'work' ? 'HOLD' : 'REST'}
                </span>
                <span className="timer-seconds">{state.secondsLeft}</span>
              </>
            )}
            {state.phase === 'done' && (
              <>
                <span className="timer-phase-label" style={{ color: ringColor }}>DONE</span>
                <span className="timer-check">✓</span>
              </>
            )}
          </div>
        </div>

        <p className="timer-status">
          {state.phase === 'idle' && `Ready · ${TOTAL_ROUNDS} rounds · ${WORK_SECONDS}s hold / ${state.restSeconds}s rest`}
          {state.phase !== 'idle' && state.phase !== 'done' && `Round ${state.round} of ${TOTAL_ROUNDS}`}
          {state.phase === 'done' && `All ${TOTAL_ROUNDS} rounds complete`}
        </p>

        <div className="round-dots" aria-hidden="true">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
            const roundNum = i + 1
            const filled = state.phase === 'done' || roundNum < state.round || (roundNum === state.round && state.phase === 'rest')
            const active = roundNum === state.round && state.phase !== 'idle' && state.phase !== 'done'
            return (
              <span
                key={i}
                className={`round-dot ${filled ? 'is-filled' : ''} ${active ? 'is-active' : ''}`}
              />
            )
          })}
        </div>

        {state.phase === 'idle' && (
          <div className="rest-select">
            <span>Rest between rounds:</span>
            <div className="rest-options">
              {[8, 9, 10].map((s) => (
                <button
                  key={s}
                  className={`rest-chip ${state.restSeconds === s ? 'is-active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_REST', value: s })}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="timer-controls">
          {state.phase === 'idle' && (
            <button className="btn btn-primary" onClick={() => dispatch({ type: 'START' })}>
              Start routine
            </button>
          )}
          {(state.phase === 'work' || state.phase === 'rest') && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => dispatch({ type: state.running ? 'PAUSE' : 'RESUME' })}
              >
                {state.running ? 'Pause' : 'Resume'}
              </button>
              <button className="btn btn-ghost" onClick={() => dispatch({ type: 'SKIP' })}>
                Skip
              </button>
              <button className="btn btn-ghost" onClick={() => dispatch({ type: 'RESET' })}>
                Reset
              </button>
            </>
          )}
          {state.phase === 'done' && (
            <>
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESET' })}>
                Do another set
              </button>
              {nextIdx && (
                <Link to={`/exercise/${nextIdx.id}`} className="btn btn-secondary">
                  Next: {nextIdx.title} →
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
