import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

/** Catch-all route. Shop, Collections, etc. replace this as Phase 8 lands. */
export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <>
      <Navbar />
      <main className="flex min-h-svh flex-col items-start justify-center px-4 sm:px-8 md:px-12">
        <p className="eyebrow text-ink/50">{pathname}</p>
        <h1 className="editorial-heading mt-4 text-[clamp(3rem,8vw,7rem)]">
          This room is still <span className="accent">being built.</span>
        </h1>
        <Link to="/" className="eyebrow mt-10 border-b border-terracotta pb-1 text-terracotta">
          Back to the doorway
        </Link>
      </main>
    </>
  )
}
