import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BrandLoader from '../components/BrandLoader'
import StoryExperience from '../sections/StoryExperience'
import HomeCommerce from '../sections/HomeCommerce'
import { useLenis } from '../hooks/useLenis'

export default function Home() {
  useLenis()
  return (
    <>
      <BrandLoader />
      <Navbar />
      <main>
        <StoryExperience />
        <HomeCommerce />
      </main>
      <Footer />
    </>
  )
}
