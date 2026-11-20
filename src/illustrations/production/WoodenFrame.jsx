import { ILLU } from '../shared/palette'

const beam = {
  fill: ILLU.oak,
  stroke: ILLU.oakDeep,
  strokeWidth: 7,
  strokeLinejoin: 'round',
}

/** Editable oak members aligned to the supplied straight-on Linnea artwork. */
export default function WoodenFrame() {
  return (
    <g id="sofa-wooden-frame" aria-label="Exposed oak two-seater sofa frame">
      <g transform="translate(524 203.24) scale(0.56)">
        <g id="sofa-base-frame">
          <g id="sofa-rear-rail">
            <path d="M282 566 Q600 548 918 566 L918 586 Q600 568 282 586 Z" {...beam} />
          </g>
          <g id="sofa-front-rail">
            <path d="M260 582 Q600 600 940 582 L940 625 Q600 642 260 625 Z" {...beam} />
          </g>
          <g id="sofa-side-rails">
            <path d="M260 582 L282 566 L282 586 L260 603 Z" {...beam} />
            <path d="M940 582 L918 566 L918 586 L940 603 Z" {...beam} />
          </g>
          <g id="sofa-cross-support">
            <path d="M355 584 H845 V601 H355 Z" {...beam} />
            <path d="M355 584 H845" fill="none" stroke={ILLU.rawWood} strokeWidth="3" opacity="0.6" />
          </g>
        </g>

        <g id="sofa-rear-legs" fill={ILLU.oak} stroke={ILLU.oakDeep} strokeWidth="5">
          <g id="sofa-rear-leg-left"><path d="M382 598 H416 L411 708.5 H390 Z" /></g>
          <g id="sofa-rear-leg-right"><path d="M784 598 H818 L810 708.5 H789 Z" /></g>
        </g>
        <g id="sofa-front-legs" fill={ILLU.oak} stroke={ILLU.oakDeep} strokeWidth="5">
          <g id="sofa-front-leg-left"><path d="M300 606 H350 L343 704 Q326 713 309 704 Z" /></g>
          <g id="sofa-front-leg-right"><path d="M850 606 H900 L891 704 Q875 713 858 704 Z" /></g>
        </g>

        <g id="sofa-left-arm-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
          <path d="M250 578 V365 M326 585 V365 M250 390 H326" />
        </g>
        <g id="sofa-right-arm-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
          <path d="M874 585 V365 M950 578 V365 M874 390 H950" />
        </g>

        <g id="sofa-back-frame" fill="none" stroke={ILLU.oakDeep} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
          <path d="M330 425 V250 M870 425 V250 M330 270 H870" />
          <path d="M600 270 V425 M330 425 H870" />
        </g>
      </g>
    </g>
  )
}
