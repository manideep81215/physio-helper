// Minimal line-art icons, one per exercise. Stroke-based, currentColor.
const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconPillow(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path {...common} d="M20 55c0-14 13-25 30-25s30 11 30 25-13 20-30 20-30-6-30-20z" />
      <path {...common} d="M35 45c3 4 3 10 0 14M65 45c-3 4-3 10 0 14" />
      <path {...common} d="M15 68c8 6 20 9 35 9s27-3 35-9" strokeDasharray="1 9" />
    </svg>
  )
}

export function IconBallKnee(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="62" r="18" {...common} />
      <path {...common} d="M22 62c0-3 2-5 5-5M78 62c0-3-2-5-5-5" />
      <path {...common} d="M32 32c8-6 28-6 36 0" />
      <path {...common} d="M35 32l-6 14M65 32l6 14" />
    </svg>
  )
}

export function IconBallFeet(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="35" r="16" {...common} />
      <path {...common} d="M30 62c5-4 12-6 20-6s15 2 20 6" />
      <path {...common} d="M22 78h18l4-10M80 78H62l-4-10" />
    </svg>
  )
}

export function IconBallBetween(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="14" {...common} />
      <path {...common} d="M36 30c-8 6-8 34 0 40M64 30c8 6 8 34 0 40" />
    </svg>
  )
}

export function IconBridge(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path {...common} d="M18 70h64" />
      <path {...common} d="M28 70c0-20 12-34 22-34s22 14 22 34" />
      <circle cx="50" cy="30" r="7" {...common} />
    </svg>
  )
}

export function IconLegRaise(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path {...common} d="M20 75h30" />
      <circle cx="70" cy="30" r="7" {...common} />
      <path {...common} d="M65 37c-6 6-10 14-10 22" />
      <path {...common} d="M55 59c6-10 16-20 24-24" />
    </svg>
  )
}

export function IconSideLegRaise(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="25" cy="40" r="7" {...common} />
      <path {...common} d="M25 47c0 10 4 18 12 22" />
      <path {...common} d="M37 69h35" />
      <path {...common} d="M50 65c8-4 18-12 24-20" />
    </svg>
  )
}

export function IconTriangle(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <path {...common} d="M20 75L45 40 70 75z" />
      <circle cx="72" cy="30" r="7" {...common} />
      <path {...common} d="M68 37c-6 8-12 20-14 32" />
    </svg>
  )
}

export function IconSitLift(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="30" cy="30" r="7" {...common} />
      <path {...common} d="M30 37v18" />
      <path {...common} d="M30 55h20" />
      <path {...common} d="M50 55c8-2 18-6 24-12" />
    </svg>
  )
}

export function IconStand(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="24" r="8" {...common} />
      <path {...common} d="M50 32v28" />
      <path {...common} d="M50 60l-14 20M50 60l14 20" />
      <path {...common} d="M50 40l-16 10M50 40l16 10" />
    </svg>
  )
}

export const iconMap = {
  pillow: IconPillow,
  ballKnee: IconBallKnee,
  ballFeet: IconBallFeet,
  ballBetween: IconBallBetween,
  bridge: IconBridge,
  legRaise: IconLegRaise,
  sideLegRaise: IconSideLegRaise,
  triangle: IconTriangle,
  sitLift: IconSitLift,
  stand: IconStand,
}
