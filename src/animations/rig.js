/**
 * Mutable animation rig shared by GSAP (writer) and the R3F render loop (reader).
 *
 * GSAP tweens plain numbers on this object; CameraController copies them onto
 * the real camera every frame. Keeping it outside React state means scroll
 * scrubbing costs zero re-renders.
 */
export const rig = {
  camera: {
    position: { x: 0, y: 1.5, z: 7.0 },
    target: { x: 0, y: 1.42, z: 0 },
    /** 0 = no pointer parallax, 1 = full. Scenes can damp it (e.g. close-ups). */
    parallax: 1,
    /**
     * 0–1: how much of the extra wide-angle allowance to use. Only portrait /
     * tablet screens have an allowance (see CameraController), so scenes can
     * open the lens for wide arrangements without touching desktop framing.
     */
    wide: 0,
    /**
     * 0–1: what portrait framing pulls the camera's x toward. 0 = world x 0
     * (the doorway room is centred there); 1 = the current look-at target
     * (the studio scenes live at x ≈ 40–55, far from the origin).
     */
    lateralFollow: 0,
    /**
     * Extra metres to pull back along the view axis on narrow screens only
     * (scaled per breakpoint in CameraController). Lets wide studio
     * arrangements fit portrait screens without changing desktop framing.
     */
    pullback: 0,
  },
}
