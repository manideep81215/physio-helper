// Knee rehab routine — 10 exercises.
// Each round: 10s hold/work, then rest, for 10 rounds total.

export const exercises = [
  {
    id: 1,
    code: 'EX-01',
    title: 'Round pillow under knee',
    cue: 'Press it hard with current waves',
    detail:
      'Place a round pillow under your knee. Press down firmly, holding a steady, even pressure for the full round.',
    icon: 'pillow',
  },
  {
    id: 2,
    code: 'EX-02',
    title: 'Physio ball under knee',
    cue: '1kg physio ball under knee — press it',
    detail:
      'Position the 1kg physio ball beneath your knee. Press down into the ball, keeping the pressure controlled and steady.',
    icon: 'ballKnee',
  },
  {
    id: 3,
    code: 'EX-03',
    title: 'Physio ball under feet',
    cue: '1kg physio ball under feet',
    detail:
      'Rest your feet on the physio ball. Press down through your heels into the ball, holding steady each round.',
    icon: 'ballFeet',
  },
  {
    id: 4,
    code: 'EX-04',
    title: 'Ball between knees',
    cue: 'Round ball between two knees',
    detail:
      'Hold the round ball between both knees. Squeeze inward and hold firmly for each round.',
    icon: 'ballBetween',
  },
  {
    id: 5,
    code: 'EX-05',
    title: 'Body up on head and feet',
    cue: 'Keep up body on head and feet',
    detail:
      'Lift and support your body weight using your head and feet as anchor points. Hold steady and controlled.',
    icon: 'bridge',
  },
  {
    id: 6,
    code: 'EX-06',
    title: 'Lift leg up straight',
    cue: 'Straight leg raise',
    detail:
      'Lying down, lift one leg straight up while keeping the knee locked. Hold at the top for each round.',
    icon: 'legRaise',
  },
  {
    id: 7,
    code: 'EX-07',
    title: 'Side-lying leg raise',
    cue: 'Lift leg up straight on one side, sleeping',
    detail:
      'Lie on your side. Lift the top leg straight up, keeping it in line with your body, and hold.',
    icon: 'sideLegRaise',
  },
  {
    id: 8,
    code: 'EX-08',
    title: 'Leg on folded triangle',
    cue: 'Lift leg on fold triangle shape',
    detail:
      'With the leg resting on a folded triangle wedge, lift and hold it steady through each round.',
    icon: 'triangle',
  },
  {
    id: 9,
    code: 'EX-09',
    title: 'Lift leg while sitting',
    cue: 'Seated leg extension',
    detail:
      'While seated, extend and lift the leg straight out in front of you. Hold at the top of the lift.',
    icon: 'sitLift',
  },
  {
    id: 10,
    code: 'EX-10',
    title: 'Stand on feet',
    cue: 'Weight-bearing stand',
    detail:
      'Stand upright, balancing your weight evenly on both feet. Hold a stable, controlled stance.',
    icon: 'stand',
  },
]

export const getExerciseById = (id) =>
  exercises.find((e) => e.id === Number(id))

// Routine timing
export const WORK_SECONDS = 10
export const DEFAULT_REST_SECONDS = 10
export const TOTAL_ROUNDS = 10
