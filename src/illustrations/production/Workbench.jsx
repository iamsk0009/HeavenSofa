import { ILLU } from '../shared/palette'
import { BENCH_TOP } from './sofaParts'

/**
 * Long joiner's bench with a vice, the floor line, a soft backdrop disc and a
 * wall rail of hand tools. Each tool is tagged so it can drop in separately.
 */
export function Backdrop() {
  return (
    <g data-production="backdrop">
      <circle cx="880" cy="470" r="280" fill={ILLU.sageLight} opacity="0.32" />
      <circle cx="880" cy="470" r="330" fill="none" stroke={ILLU.sage} strokeWidth="1.2" opacity="0.5" />
    </g>
  )
}

export function Floor() {
  return (
    <g>
      <rect x="-400" y="820" width="2400" height="600" fill={ILLU.ground} />
      <line x1="-400" y1="820" x2="2000" y2="820" stroke={ILLU.groundDeep} strokeWidth="2" />
    </g>
  )
}

export default function Workbench() {
  const top = BENCH_TOP
  return (
    <g data-production="bench">
      {/* top */}
      <rect x="380" y={top} width="840" height="26" rx="3" fill={ILLU.oak} />
      <rect x="380" y={top} width="840" height="6" rx="3" fill={ILLU.paper} opacity="0.25" />
      {/* apron */}
      <rect x="400" y={top + 26} width="800" height="24" fill={ILLU.oakDeep} />
      {/* legs + stretcher */}
      {[412, 1158].map((x) => (
        <rect key={x} x={x} y={top + 50} width="30" height={820 - top - 50} fill={ILLU.oakDeep} />
      ))}
      <rect x="442" y="760" width="716" height="12" fill={ILLU.oakDeep} opacity="0.85" />
      {/* vice */}
      <rect x="352" y={top - 6} width="34" height="60" rx="3" fill={ILLU.oakDeep} />
      <line x1="342" y1={top + 22} x2="300" y2={top + 22} stroke={ILLU.ink} strokeWidth="4" strokeLinecap="round" />
      <line x1="300" y1={top + 8} x2="300" y2={top + 36} stroke={ILLU.ink} strokeWidth="4" strokeLinecap="round" />
      {/* floor shadow */}
      <ellipse cx="800" cy="822" rx="430" ry="8" fill={ILLU.ink} opacity="0.08" />
    </g>
  )
}

const RAIL_Y = 215

const Hang = ({ x, children }) => (
  <g transform={`translate(${x} ${RAIL_Y})`}>
    <g data-production="tool">
      <circle cx="0" cy="0" r="3" fill={ILLU.ink} />
      {children}
    </g>
  </g>
)

export function ToolRack() {
  const s = { stroke: ILLU.ink, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <g>
      <line x1="1250" y1={RAIL_Y} x2="1530" y2={RAIL_Y} stroke={ILLU.oakDeep} strokeWidth="6" strokeLinecap="round" />
      {/* tenon saw */}
      <Hang x={1285}>
        <path d="M0 4 L-14 18 L-14 150 L22 150 L22 18 Z" fill={ILLU.cream} {...s} />
        <rect x="-18" y="2" width="44" height="20" rx="8" fill={ILLU.oakDeep} />
      </Hang>
      {/* mallet */}
      <Hang x={1350}>
        <line x1="0" y1="4" x2="0" y2="96" {...s} strokeWidth="5" stroke={ILLU.oakDeep} />
        <rect x="-22" y="96" width="44" height="34" rx="5" fill={ILLU.oak} />
      </Hang>
      {/* chisels */}
      <Hang x={1405}>
        <rect x="-5" y="4" width="10" height="44" rx="4" fill={ILLU.terracotta} />
        <path d="M-3 48 L3 48 L4 120 L-4 120 Z" fill={ILLU.inkSoft} />
      </Hang>
      <Hang x={1440}>
        <rect x="-5" y="4" width="10" height="40" rx="4" fill={ILLU.forest} />
        <path d="M-2.5 44 L2.5 44 L3 100 L-3 100 Z" fill={ILLU.inkSoft} />
      </Hang>
      {/* try square */}
      <Hang x={1492}>
        <path d="M-4 4 L-4 120 L60 120 L60 108 L8 108 L8 4 Z" fill={ILLU.oakDeep} />
        <path d="M8 108 L60 108" {...s} strokeWidth="1" />
      </Hang>
    </g>
  )
}
