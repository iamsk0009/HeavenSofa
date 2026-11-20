import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Wordmark, { BRAND } from './Wordmark'
import { selectCartCount, useShopStore } from '../store/useShopStore'

const LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'Configurator', to: '/configurator' },
  { label: 'About', to: '/about' },
]

const activeLink = ({ isActive }) => `eyebrow transition-colors hover:text-terracotta ${isActive ? 'text-terracotta' : 'text-ink/75'}`

export default function Navbar() {
  const cartCount = useShopStore(selectCartCount)
  const wishlistCount = useShopStore((state) => state.wishlist.length)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const closeMenu = () => setMenuOpen(false)
  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    closeMenu()
  }

  return (
    <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav className="pointer-events-auto mx-auto flex min-h-[72px] max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-8 md:px-10">
        <Link to="/" onClick={closeMenu} className="shrink-0 text-ink" aria-label={`${BRAND.name} home`}>
          <Wordmark className="text-sm sm:text-base" />
        </Link>

        <ul className="hidden items-center gap-4 lg:flex">
          {LINKS.map((link) => <li key={link.to}><NavLink to={link.to} className={activeLink}>{link.label}</NavLink></li>)}
        </ul>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pieces" aria-label="Search products" className="shop-input w-36 py-2" />
              <button className="eyebrow text-terracotta" type="submit">Go</button>
              <button className="eyebrow text-ink/45" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">Close</button>
            </form>
          ) : <button type="button" className="eyebrow text-ink/75 transition-colors hover:text-terracotta" onClick={() => setSearchOpen(true)}>Search</button>}
          <NavLink to="/wishlist" className={activeLink} aria-label={`Wishlist, ${wishlistCount} saved`}>Wishlist <span className="text-ink/50">({wishlistCount})</span></NavLink>
          <NavLink to="/cart" className={activeLink} aria-label={`Cart, ${cartCount} items`}>Cart ({cartCount})</NavLink>
        </div>

        <div className="ml-auto flex items-center gap-4 lg:hidden">
          <Link to="/wishlist" className="text-xl text-ink" aria-label={`Wishlist, ${wishlistCount} saved`}>♡<span className="sr-only"> Wishlist ({wishlistCount})</span></Link>
          <Link to="/cart" className="eyebrow text-ink" aria-label={`Cart, ${cartCount} items`}>Bag {cartCount}</Link>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="grid h-10 w-10 place-items-center text-2xl text-ink">
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="pointer-events-auto border-t border-ink/10 bg-paper px-5 pb-7 pt-5 shadow-lg lg:hidden">
          <form onSubmit={submitSearch} className="mb-5 flex gap-2">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" aria-label="Search products" className="shop-input min-w-0 flex-1" />
            <button type="submit" className="eyebrow text-terracotta">Search</button>
          </form>
          <div className="grid gap-5">
            {LINKS.map((link) => <NavLink key={link.to} to={link.to} onClick={closeMenu} className={activeLink}>{link.label}</NavLink>)}
            <NavLink to="/contact" onClick={closeMenu} className={activeLink}>Contact</NavLink>
          </div>
        </div>
      )}
      {location.pathname !== '/' && <span className="sr-only" aria-live="polite">{BRAND.tagline}</span>}
    </header>
  )
}
