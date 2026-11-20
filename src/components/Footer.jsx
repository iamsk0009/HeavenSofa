import { Link } from 'react-router-dom'
import Wordmark, { BRAND } from './Wordmark'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-olive px-4 py-14 text-paper sm:px-8 md:px-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">
        <div>
          <Wordmark className="text-3xl sm:text-4xl" />
          <p className="mt-5 font-serif text-xl font-light italic text-paper/90">{BRAND.tagline}</p>
          <p className="eyebrow mt-3 text-paper/55">{BRAND.descriptor}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">Furniture cut, shaped and joined by hand—from forest to home.</p>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Explore</p>
          <ul className="mt-4 grid gap-3 text-sm text-paper/80">
            <li><Link className="hover:text-paper" to="/shop">Shop all</Link></li>
            <li><Link className="hover:text-paper" to="/collections">Collections</Link></li>
            <li><Link className="hover:text-paper" to="/about">Our story</Link></li>
            <li><Link className="hover:text-paper" to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Care</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/80">Thoughtful materials<br />Made to live with</p>
        </div>
        <div>
          <p className="eyebrow text-paper/50">Catalogue note</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">This is a sample frontend catalogue. Product details, prices and availability are illustrative.</p>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl border-t border-paper/15 pt-5 text-xs text-paper/45">© {new Date().getFullYear()} {BRAND.name}</p>
    </footer>
  )
}
  