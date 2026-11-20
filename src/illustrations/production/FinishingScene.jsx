import { ILLU } from '../shared/palette'
import { BENCH_TOP } from './sofaParts'

// The finishing illustration uses a front-right three-quarter view: the front
// cushions stay legible while the right side plane gives the sofa real depth.
const BACK_LEFT = 'M711 321 Q712 308 728 309 L854 318 Q868 319 868 333 L861 413 Q860 424 846 422 L713 408 Q703 407 704 395 L708 333 Q708 325 711 321 Z'
const BACK_RIGHT = 'M879 321 L1007 331 Q1021 333 1020 347 L1012 432 Q1011 443 997 441 L872 426 Q860 424 862 411 L869 335 Q870 322 879 321 Z'
// ── Linnea Armrest Shared Design Specification ──────────────────────
// Both armrests share identical underlying construction parameters:
// - Physical front width: 52px (both sides, x-span of front face)
// - Front face left-edge height: 64px (arm top to base-overlap start)
// - Full arm vertical span: 84px (top crown to bottom corner)
// - Rise above seat cushion front edge: +8px
// - Foam padding crown: 4px curvature
// - Inset welt piping: 1.2px STCH
// - Top roll highlight: 2.6px LIGHT
//
// Perspective transformation (front-right 3/4 yaw, slope +0.100W, -0.586D):
// - Base top y-offset left→right: +34px over the full sofa width
// - Left arm: front face + top surface visible; outer left side hidden
// - Right arm: front face + top surface + visible right-side depth plane
// - Right arm top corrected +18px so both arms share the same 84px span
const ARM_LEFT_TOP = 'M662 404 Q688 399 714 410 Q720 396 724 384 Q716 376 696 378 Q680 380 676 388 Q668 396 662 404 Z'
const ARM_LEFT_FRONT = 'M662 404 Q688 399 714 410 L712 478 Q710 486 704 488 L670 480 Q662 478 662 468 Q660 436 662 404 Z'
const ARM_RIGHT_TOP = 'M1006 422 Q1032 417 1058 428 Q1074 410 1086 398 Q1080 390 1060 392 Q1044 394 1034 398 Q1018 408 1006 422 Z'
const ARM_RIGHT_SIDE = 'M1058 428 Q1074 410 1086 398 Q1090 404 1088 430 L1084 478 Q1082 484 1076 486 Q1066 494 1058 502 Q1060 465 1058 428 Z'
const ARM_RIGHT_FRONT = 'M1006 422 Q1032 417 1058 428 Q1060 466 1058 502 Q1056 508 1042 506 L1016 498 Q1006 494 1006 488 Q1005 460 1006 422 Z'
const SEAT_LEFT = 'M703 412 Q705 403 716 405 L863 427 Q878 429 876 443 L870 470 Q868 482 855 480 L701 456 Q690 454 693 442 L697 420 Q698 414 703 412 Z'
const SEAT_RIGHT = 'M880 430 L1022 450 Q1037 452 1034 467 L1028 493 Q1026 505 1012 503 L868 480 L870 454 Q871 428 880 430 Z'
const BASE_FRONT = 'M681 466 L1020 500 L1017 536 L675 500 Z'
const BASE_RIGHT = 'M1020 500 L1078 466 L1074 500 L1017 536 Z'
const UPHOLSTERY_REVEALS = [
  ['backrest', 680, 300, 410, 170],
  ['base', 660, 440, 430, 110],
  ['arm-left', 650, 365, 100, 140],
  ['arm-right', 982, 338, 132, 170],
  ['seat-left', 686, 400, 195, 90],
  ['seat-right', 862, 425, 185, 90],
  ['back-left', 695, 305, 180, 125],
  ['back-right', 858, 318, 175, 135],
]

const FAB = '#D9C7AA'
const LIGHT = '#E9D9BF'
const SHADE = '#B9A587'
const DEEP = '#927C60'
const STCH = '#AF9875'
const LEG = '#A77B4F'
const LEG_S = '#785B3C'

export default function FinishingScene({ compact = false }) {
  const star = 'M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z'

  return (
    <g>
      <defs>
        <linearGradient id="production-sofa-linen" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor={LIGHT} />
          <stop offset="0.55" stopColor={FAB} />
          <stop offset="1" stopColor={SHADE} />
        </linearGradient>
        <linearGradient id="production-sofa-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SHADE} />
          <stop offset="1" stopColor={DEEP} />
        </linearGradient>
        <linearGradient id="production-sofa-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SHADE} />
          <stop offset="1" stopColor={DEEP} />
        </linearGradient>
        <linearGradient id="production-sofa-oak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={LEG_S} />
          <stop offset="0.38" stopColor={LEG} />
          <stop offset="0.75" stopColor={LEG} />
          <stop offset="1" stopColor={LEG_S} />
        </linearGradient>
        <filter id="production-sofa-shadow" x="-12%" y="-12%" width="124%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
          <feOffset in="blur" dy="5" result="offsetBlur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="production-linen-weave" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 1.5H8 M0 5.5H8" stroke={LIGHT} strokeWidth="0.55" opacity="0.72" />
          <path d="M1.5 0V8 M5.5 0V8" stroke={SHADE} strokeWidth="0.45" opacity="0.48" />
        </pattern>
        <clipPath id="production-sofa-fabric">
          {[BACK_LEFT, BACK_RIGHT, ARM_LEFT_TOP, ARM_LEFT_FRONT, ARM_RIGHT_TOP, ARM_RIGHT_SIDE, ARM_RIGHT_FRONT, SEAT_LEFT, SEAT_RIGHT, BASE_FRONT, BASE_RIGHT].map((path, index) => <path key={index} d={path} />)}
        </clipPath>
        {UPHOLSTERY_REVEALS.map(([name, x, y, width, height]) => (
          <clipPath key={name} id={`sofa-${name}-wipe`} clipPathUnits="userSpaceOnUse">
            <rect id={`sofa-${name}-wipe-rect`} x={x} y={y} width="0" height={height} />
          </clipPath>
        ))}
      </defs>

      <ellipse data-production="shadow" cx="864" cy={BENCH_TOP + 2} rx="238" ry="9" fill={ILLU.ink} opacity="0.16" />

      {/* Keep the complete finished sofa in the existing scrubbed timeline group. */}
      <g id="sofa-upholstery" data-production="cushion" filter="url(#production-sofa-shadow)">
        <g data-sofa-component="legs" fill="url(#production-sofa-oak)">
          {/* Rear pair, recessed behind the upholstered body. */}
          <path d={`M722 500 L738 502 L734 ${BENCH_TOP} L720 ${BENCH_TOP} Z`} fill={LEG_S} />
          <path d={`M1038 516 L1053 508 L1054 ${BENCH_TOP} L1040 ${BENCH_TOP} Z`} fill={LEG_S} />
          {/* Front pair. The staggered tops follow the sofa's perspective. */}
          <path d={`M674 493 L695 497 L692 ${BENCH_TOP} L675 ${BENCH_TOP} Z`} />
          <path d={`M1009 527 L1030 519 L1033 ${BENCH_TOP} L1015 ${BENCH_TOP} Z`} />
          <path d={`M677 500 L685 502 L683 ${BENCH_TOP - 4} L676 ${BENCH_TOP - 4} Z`} fill={LIGHT} opacity="0.34" />
          <path d={`M1012 532 L1020 529 L1023 ${BENCH_TOP - 4} L1016 ${BENCH_TOP - 4} Z`} fill={LIGHT} opacity="0.34" />
        </g>

        {/* Upholstered back shell and its visible right-side depth plane. */}
        <g id="sofa-backrest-fabric" data-sofa-component="backrest" clipPath="url(#sofa-backrest-wipe)">
          <path d="M690 330 Q693 313 711 313 L1028 334 Q1041 336 1043 351 L1036 445 L704 418 Z" fill="url(#production-sofa-linen)" />
          <path d="M1028 334 L1074 362 L1068 459 L1036 445 Z" fill="url(#production-sofa-side)" />
          <path d="M704 331 Q707 317 722 318 L1024 339" fill="none" stroke={LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* Foam padding is exposed briefly before the linen panels wrap over it. */}
        <g id="sofa-back-foam" data-sofa-component="foam-back" fill="#E9DCC8" stroke={LIGHT} strokeWidth="2" opacity="0.94">
          <path d={BACK_LEFT} />
          <path d={BACK_RIGHT} />
        </g>
        <g id="sofa-seat-foam" data-sofa-component="foam-seat" fill="#E9DCC8" stroke={LIGHT} strokeWidth="2" opacity="0.94">
          <path d={SEAT_LEFT} />
          <path d={SEAT_RIGHT} />
        </g>
        <g id="sofa-arm-foam" data-sofa-component="foam-arms" fill="#E9DCC8" stroke={LIGHT} strokeWidth="2" opacity="0.94">
          <path d={ARM_LEFT_FRONT} />
          <path d={ARM_RIGHT_FRONT} />
        </g>

        {/* Two separate, softly crowned back cushions with stitched welts. */}
        <g data-sofa-layer="back-cushions">
          <g id="sofa-back-left" data-sofa-component="back-cushion-left" clipPath="url(#sofa-back-left-wipe)">
          <path d={BACK_LEFT} fill="url(#production-sofa-linen)" />
          <path d="M711 321 Q713 312 728 313 L854 322 Q865 323 865 335 L861 352 Q832 344 795 339 Q752 332 708 342 Z" fill={LIGHT} opacity="0.38" />
          <path d="M712 392 Q775 406 860 407 L859 415 Q858 423 846 421 L714 407 Q705 406 706 396 Z" fill={SHADE} opacity="0.32" />
          <path d="M720 320 Q722 315 732 316 L851 325 Q860 326 860 335 L853 410 Q852 415 844 414 L718 401 Q712 400 713 392 Z" fill="none" stroke={STCH} strokeWidth="1.15" />
          </g>
          <g id="sofa-back-right" data-sofa-component="back-cushion-right" clipPath="url(#sofa-back-right-wipe)">
          <path d={BACK_RIGHT} fill="url(#production-sofa-linen)" />
          <path d="M879 323 L1005 333 Q1017 335 1017 347 L1014 363 Q977 353 941 347 Q903 342 869 348 Z" fill={LIGHT} opacity="0.36" />
          <path d="M869 411 Q928 425 1013 426 L1011 435 Q1010 443 997 441 L873 426 Q862 424 863 412 Z" fill={SHADE} opacity="0.34" />
          <path d="M882 328 L1002 338 Q1012 339 1011 348 L1004 431 Q1003 436 995 435 L875 420 Q868 419 869 410 L876 338 Q877 328 882 328 Z" fill="none" stroke={STCH} strokeWidth="1.15" />
          </g>
          <path d="M866 328 L862 411" fill="none" stroke={DEEP} strokeWidth="2" opacity="0.58" />
        </g>

        {/* Seat deck and lower upholstered base. */}
        <g id="sofa-base-fabric" data-sofa-component="base" clipPath="url(#sofa-base-wipe)">
          <path d="M682 449 L1024 483 L1046 495 L1038 527 L676 492 Z" fill="url(#production-sofa-front)" />
          <path d={BASE_FRONT} fill="url(#production-sofa-front)" />
          <path d={BASE_RIGHT} fill="url(#production-sofa-side)" />
          <path d="M681 467 L1020 501" fill="none" stroke={LIGHT} strokeWidth="2" opacity="0.45" />
          <path d="M691 477 L1008 509" fill="none" stroke={STCH} strokeWidth="1.1" opacity="0.68" />
        </g>

        {/* Deep seat pads: two rounded cushions, each with a readable front boxing. */}
        <g data-sofa-layer="seat-cushions">
          <g id="sofa-seat-left" data-sofa-component="seat-cushion-left" clipPath="url(#sofa-seat-left-wipe)">
          <path d={SEAT_LEFT} fill="url(#production-sofa-linen)" />
          <path d="M698 439 L870 463 Q869 476 855 480 L701 456 Q691 454 693 442 Z" fill="url(#production-sofa-front)" opacity="0.65" />
          <path d="M706 418 Q708 407 719 409 L860 430 Q871 432 870 443" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.76" />
          <path d="M708 418 Q710 412 719 414 L858 435 Q866 436 865 444 L861 461 Q860 467 851 466 L706 444 Q700 443 701 436 Z" fill="none" stroke={STCH} strokeWidth="1.15" />
          </g>
          <g id="sofa-seat-right" data-sofa-component="seat-cushion-right" clipPath="url(#sofa-seat-right-wipe)">
          <path d={SEAT_RIGHT} fill="url(#production-sofa-linen)" />
          <path d="M872 463 L1032 484 Q1031 498 1012 503 L868 480 Z" fill="url(#production-sofa-front)" opacity="0.66" />
          <path d="M879 436 L1018 456 Q1030 458 1029 469" fill="none" stroke={LIGHT} strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
          <path d="M880 439 L1017 459 Q1026 461 1024 470 L1020 487 Q1019 494 1010 492 L873 471 L875 451 Q876 440 880 439 Z" fill="none" stroke={STCH} strokeWidth="1.15" />
          </g>
          <path d="M877 432 L870 476" fill="none" stroke={DEEP} strokeWidth="1.4" opacity="0.68" />
        </g>

        {/* Rounded upholstered arms; the right outer face is wider to show depth. */}
        <g data-sofa-layer="arm-upholstery">
          <g id="sofa-left-arm-fabric" data-sofa-component="arm-left" clipPath="url(#sofa-arm-left-wipe)">
          <path d={ARM_LEFT_TOP} fill={LIGHT} />
          <path d={ARM_LEFT_FRONT} fill="url(#production-sofa-linen)" />
          <path d="M706 410 L714 412 L712 478 L704 484 Z" fill={SHADE} opacity="0.52" />
          <path d="M668 412 Q690 407 708 416 L706 474 Q704 480 698 482 L674 474 Q668 472 668 464 Z" fill="none" stroke={STCH} strokeWidth="1.2" />
          <path d="M668 401 Q684 388 702 382 Q714 380 720 386" fill="none" stroke={LIGHT} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M662 474 Q686 484 710 486" fill="none" stroke={DEEP} strokeWidth="1.3" opacity="0.46" />
          </g>
          <g id="sofa-right-arm-fabric" data-sofa-component="arm-right" clipPath="url(#sofa-arm-right-wipe)">
          <path d={ARM_RIGHT_TOP} fill={LIGHT} />
          <path d={ARM_RIGHT_SIDE} fill="url(#production-sofa-side)" />
          <path d={ARM_RIGHT_FRONT} fill="url(#production-sofa-linen)" />
          <path d="M1006 422 L1014 424 L1014 494 L1006 489 Z" fill={SHADE} opacity="0.52" />
          <path d="M1012 428 Q1032 423 1050 432 Q1052 464 1050 498 Q1040 501 1018 494 Q1012 490 1012 470 Z" fill="none" stroke={STCH} strokeWidth="1.2" />
          <path d="M1014 422 Q1036 414 1056 408 Q1070 402 1080 399" fill="none" stroke={LIGHT} strokeWidth="2.6" strokeLinecap="round" opacity="0.82" />
          <path d="M1058 428 Q1060 466 1058 502" fill="none" stroke={DEEP} strokeWidth="1.1" opacity="0.32" />
          <path d="M1006 490 Q1030 500 1056 504 Q1068 495 1078 486" fill="none" stroke={DEEP} strokeWidth="1.3" opacity="0.48" />
          </g>
        </g>

        {/* Woven linen stays clipped to the editable upholstery silhouettes. */}
        <rect x="650" y="300" width="470" height="220" fill="url(#production-linen-weave)" clipPath="url(#production-sofa-fabric)" opacity="0.17" pointerEvents="none" />
      </g>

      {[[1092, 318, 1], [742, 296, 0.7], [1082, 455, 0.6]].map(([x, y, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
          <path data-production="sparkle" d={star} fill={ILLU.ochre} />
        </g>
      ))}

      <g transform={compact ? 'translate(870 236)' : 'translate(1118 298)'}>
        <g data-production="label" textAnchor={compact ? 'middle' : 'start'}>
          {!compact && <line x1="-14" y1="6" x2="-88" y2="52" stroke={ILLU.ink} strokeWidth="1" />}
          <text fontFamily="Fraunces, serif" fontSize="26" fill={ILLU.ink}>Linnea</text>
          <text y="28" fontFamily="Fraunces, serif" fontSize="15" fontStyle="italic" fill={ILLU.inkSoft}>Two-seater sofa</text>
          <text y="50" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="2.5" fill={ILLU.inkSoft}>STONEWASHED LINEN · OAK</text>
        </g>
      </g>
    </g>
  )
}
