import { ILLU } from '../shared/palette'
import { BENCH_TOP } from './sofaParts'

const beam = {
  fill: ILLU.oak,
  stroke: ILLU.oakDeep,
  strokeWidth: 2,
  strokeLinejoin: 'round',
}

/** Scene 04 only: independently movable oak members in the sofa's final perspective. */
export default function WoodenFrame() {
  return (
    <g id="sofa-wooden-frame" aria-label="Exposed oak two-seater sofa frame">
      <g id="sofa-base-frame">
        <g id="sofa-rear-rail">
          <path d="M712 464 L1037 493 L1037 507 L712 478 Z" {...beam} />
        </g>
        <g id="sofa-front-rail">
          <path d="M679 484 L1022 516 L1022 532 L679 498 Z" {...beam} />
        </g>
        <g id="sofa-side-rails">
          <path d="M679 484 L712 464 L712 478 L679 498 Z" {...beam} />
          <path d="M1022 516 L1037 493 L1037 507 L1022 532 Z" {...beam} />
        </g>
        <g id="sofa-cross-support">
          <path d="M816 497 L839 479 L839 493 L816 510 Z" {...beam} />
          <path d="M927 508 L950 488 L950 502 L927 521 Z" {...beam} />
        </g>
      </g>

      <g id="sofa-rear-legs" fill={ILLU.oak} stroke={ILLU.oakDeep} strokeWidth="1.5">
        <g id="sofa-rear-leg-left"><path d={`M724 475 L738 478 L734 ${BENCH_TOP} L720 ${BENCH_TOP} Z`} /></g>
        <g id="sofa-rear-leg-right"><path d={`M1030 500 L1045 492 L1047 ${BENCH_TOP} L1034 ${BENCH_TOP} Z`} /></g>
      </g>
      <g id="sofa-front-legs" fill={ILLU.oak} stroke={ILLU.oakDeep} strokeWidth="1.5">
        <g id="sofa-front-leg-left"><path d={`M675 495 L693 499 L690 ${BENCH_TOP} L674 ${BENCH_TOP} Z`} /></g>
        <g id="sofa-front-leg-right"><path d={`M1008 526 L1028 518 L1031 ${BENCH_TOP} L1013 ${BENCH_TOP} Z`} /></g>
      </g>

      <g id="sofa-left-arm-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M681 482 L681 395 L713 403 L713 490" />
        <path d="M681 404 L713 412" />
      </g>
      <g id="sofa-right-arm-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1017 514 L1017 401 L1055 381 L1055 500" />
        <path d="M1017 409 L1055 389" />
      </g>

      <g id="sofa-back-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M713 407 L713 345 L1027 370 L1027 403" />
        <path d="M713 407 L1027 431" />
        <path d="M868 358 L868 421 M1027 370 L1047 382 L1040 451" />
        <path d="M713 345 L728 337 L1047 363 L1027 370" />
      </g>
    </g>
  )
}
