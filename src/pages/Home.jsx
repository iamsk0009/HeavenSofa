import { lazy, Suspense } from 'react'
import BrandLoader from '../components/BrandLoader'

const HomePageContent = lazy(() => import('./HomePageContent'))

export default function Home() {
  return (
    <>
      <BrandLoader />
      <Suspense fallback={null}>
        <HomePageContent />
      </Suspense>
    </>
  )
}
