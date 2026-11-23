import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StoryExperience from '../sections/StoryExperience'
import HomeCommerce from '../sections/HomeCommerce'
import { useLenis } from '../hooks/useLenis'
import { markHomepageReady, resetHomepageReadiness } from '../experience/homepageReadiness'

export default function HomePageContent() {
  useLenis()
  useEffect(() => {
    let cancelled = false
    let timeout
    const fonts = document.fonts
    const fontLoads = fonts
      ? Promise.all([
          fonts.load('300 16px Fraunces'),
          fonts.load('italic 300 16px Fraunces'),
          fonts.load('300 16px Inter'),
          fonts.load('400 16px Inter'),
          fonts.load('500 16px Inter'),
        ]).then(() => fonts.ready)
      : Promise.resolve()
    Promise.race([
      fontLoads,
      new Promise((resolve) => { timeout = setTimeout(resolve, 10000) }),
    ]).catch(() => {
      // Web fonts are noncritical: the site typography stacks provide fallback faces.
    }).finally(() => {
      clearTimeout(timeout)
      if (!cancelled) markHomepageReady('fontsReady')
    })
    return () => {
      cancelled = true
      clearTimeout(timeout)
      resetHomepageReadiness()
    }
  }, [])
  return (
    <>
      <Navbar />
      <main>
        <StoryExperience />
        <HomeCommerce />
      </main>
      <Footer />
    </>
  )
}
