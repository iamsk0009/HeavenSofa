import { ILLU } from '../shared/palette'

/**
 * Editorial figure: slender, faceless, built from a few calm shapes (long
 * coat, small head with a hair cap, line limbs). Origin = between the feet;
 * natural height ≈ 100 units before `scale`.
 *
 * Animatable parts are tagged for the timeline:
 *   [data-leg="a" | "b"]  rotate from the hip (walking)
 *   [data-arm]            rotate from the shoulder (working)
 * `children` render in the figure's local space (e.g. a carried log).
 */
export default function Character({
  x = 0,
  y = 0,
  scale = 1,
  coat = ILLU.forest,
  trousers = ILLU.ink,
  hair = ILLU.ink,
  apron,
  armPose = 'down',
  flip = false,
  limb = 5.5, // stroke width of arms/legs before scale — lower for large figures

  children,
  ...rest
}) {
  const sx = flip ? -scale : scale
  const arm = armPose === 'forward' ? 'M0 0 L10 18 L24 24' : armPose === 'up' ? 'M0 0 L4 -16' : 'M0 0 L3 28'
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${scale})`} {...rest}>
      {/* legs (hip at y = -44) */}
      {['b', 'a'].map((leg, i) => (
        <g key={leg} data-leg={leg} transform="translate(0 -44)">
          <line x1={i ? 2 : -2} y1="0" x2={i ? 2 : -2} y2="42" stroke={trousers} strokeWidth={limb} strokeLinecap="round" />
        </g>
      ))}

      {/* coat */}
      <path d="M-10 -82 Q-14 -60 -16 -38 Q0 -34 16 -38 Q14 -60 10 -82 Q0 -86 -10 -82 Z" fill={coat} />
      {apron && <path d="M-8 -66 L8 -66 L11 -36 Q0 -33 -11 -36 Z" fill={apron} />}

      {/* arm */}
      <g data-arm transform="translate(4 -78)">
        <path d={arm} fill="none" stroke={coat} strokeWidth={limb} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* head */}
      <rect x="-2.5" y="-90" width="5" height="8" fill={ILLU.skin} />
      <circle cx="0" cy="-95" r="7.5" fill={ILLU.skin} />
      <path d="M-7.5 -95 A7.5 7.5 0 0 1 7.5 -96 Q2 -99 -7.5 -95 Z" fill={hair} />

      {children}
    </g>
  )
}
