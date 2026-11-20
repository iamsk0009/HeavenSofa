import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

// MotionPath: illustrated walkers follow SVG paths (Scene 03)
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP)

// Mobile URL-bar show/hide must not re-measure the whole story.
ScrollTrigger.config({ ignoreMobileResize: true })

gsap.defaults({ ease: 'power2.out' })

export { gsap, ScrollTrigger }
