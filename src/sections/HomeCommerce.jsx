import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLLECTIONS, PRODUCTS } from '../data/catalog'
import { CollectionCard, ProductGrid, SampleNotice, StoreHeading } from '../components/StoreComponents'
import ResponsiveImage from '../components/ResponsiveImage'
import { useExperienceStore } from '../store/useExperienceStore'
import { useHomepageReadiness } from '../experience/homepageReadiness'

const picks = (slugs) => slugs.map((slug) => PRODUCTS.find((product) => product.slug === slug)).filter(Boolean)

function Newsletter() {
  const [status, setStatus] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setStatus('Thank you for your interest. This preview does not store or send email addresses.')
  }
  return (
    <section className="bg-olive px-5 py-16 text-paper sm:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-9 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div><p className="eyebrow text-paper/55">Letters from the studio</p><h2 className="editorial-heading mt-4 text-4xl sm:text-5xl">A little more room to breathe.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/70">Occasional notes on materials, making and thoughtful living.</p></div>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder="Your email address" className="border-b border-paper/35 bg-transparent px-1 py-3 text-sm text-paper outline-none placeholder:text-paper/45 focus:border-paper" />
          <button className="eyebrow justify-self-start border-b border-terracotta pb-1 text-paper" type="submit">Join the list</button>
          <p role="status" aria-live="polite" className="text-xs text-paper/65 sm:col-span-2">{status || 'No email is sent or stored in this frontend preview.'}</p>
        </form>
      </div>
    </section>
  )
}

function EditorialPhoto({ src, alt, caption, className = '', sizes = '(min-width: 1024px) 50vw, 100vw' }) {
  return (
    <figure className={`editorial-photo ${className}`}>
      <ResponsiveImage src={src} alt={alt} width="1536" height="1024" sizes={sizes} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export default function HomeCommerce() {
  const [shouldRender, setShouldRender] = useState(false)
  const progress = useExperienceStore((s) => s.progress)
  const { entered } = useHomepageReadiness()

  useEffect(() => {
    if (shouldRender) return

    if (progress > 0.02 || (typeof window !== 'undefined' && window.scrollY > 30)) {
      setShouldRender(true)
      return
    }

    const onScroll = () => {
      if (window.scrollY > 30) setShouldRender(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let timer
    if (entered) {
      timer = setTimeout(() => setShouldRender(true), 3500)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [shouldRender, progress, entered])

  if (!shouldRender) {
    return <div className="home-commerce min-h-[40vh]" aria-hidden="true" />
  }

  const newest = [...PRODUCTS].sort((a, b) => b.year - a.year || a.featured - b.featured).slice(0, 4)
  return (
    <div className="home-commerce">
      <section className="store-section pt-20 sm:pt-24">
        <EditorialPhoto src="/images/lifestyle/homepage/heaven-homepage-living.jpg" alt="Sunlit ivory living room with natural oak and linen furniture" caption="A beautiful way to live" className="home-commerce-hero mb-12" sizes="100vw" />
        <StoreHeading as="h2" eyebrow="A place for every day" title="Find your way home." description="Explore furniture shaped by quiet forms, natural materials and the rituals that make a house your own." />
        <SampleNotice className="mt-5" />
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.slice(0, 3).map((collection) => <CollectionCard key={collection.slug} collection={collection} />)}
        </div>
      </section>

      <section className="store-section border-t border-ink/10">
        <div className="flex flex-wrap items-end justify-between gap-4"><StoreHeading as="h2" eyebrow="Just arrived" title="New pieces." /><Link to="/shop?sort=newest" className="eyebrow border-b border-terracotta pb-1 text-terracotta">View all</Link></div>
        <div className="mt-8"><ProductGrid products={newest} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" /></div>
      </section>

      <section className="bg-limestone/35 px-4 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><StoreHeading as="h2" eyebrow="Best sellers · sample edit" title="Best loved forms." /><Link to="/shop" className="eyebrow border-b border-terracotta pb-1 text-terracotta">Explore the shop</Link></div><div className="mt-8"><ProductGrid products={picks(['linnea-sofa', 'ora-lounge-chair', 'terra-coffee-table'])} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" /></div></div>
      </section>

      <section className="store-section grid items-center gap-9 lg:grid-cols-[1fr_1fr]">
        <EditorialPhoto src="/images/lifestyle/living-room/living-room-linnea.jpg" alt="Linnea inspired linen sofa in a warm architectural living room" caption="Natural textures, made to live with" className="min-h-80" />
        <div><p className="eyebrow text-terracotta">Featured furniture · Linnea</p><h2 className="editorial-heading mt-4 text-4xl sm:text-5xl">A familiar place to land.</h2><p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/65">Soft stonewashed linen, a solid beech frame and a generous two-seat silhouette. Linnea is designed to make room for the everyday.</p><Link to="/products/linnea-sofa" className="eyebrow mt-7 inline-block border-b border-terracotta pb-1 text-terracotta">Meet Linnea</Link></div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.75fr_1.25fr]">
          <div><p className="eyebrow text-terracotta">Our point of view</p><h2 className="editorial-heading mt-4 text-4xl sm:text-5xl">A beautiful way to live.</h2></div>
          <p className="max-w-2xl self-end text-base leading-relaxed text-ink/65">We believe a room is made as much by what we leave out as by what we bring in. HEAVEN &amp; CO. explores furniture as part of architecture: purposeful, tactile and made to find its place over time.</p>
        </div>
      </section>

      <section className="bg-walnut px-4 py-16 text-paper sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-9 md:grid-cols-3">
          <div><p className="eyebrow text-paper/55">01 · Material</p><h2 className="mt-4 font-serif text-3xl">Honest by nature.</h2><p className="mt-3 text-sm leading-relaxed text-paper/70">Oak, beech, linen and clay bring their own grain, warmth and character to every room.</p></div>
          <div><p className="eyebrow text-paper/55">02 · Making</p><h2 className="mt-4 font-serif text-3xl">Joined with care.</h2><p className="mt-3 text-sm leading-relaxed text-paper/70">Thoughtful construction keeps the focus on comfort, repairability and the life of a piece.</p></div>
          <div><p className="eyebrow text-paper/55">03 · Time</p><h2 className="mt-4 font-serif text-3xl">Made to stay.</h2><p className="mt-3 text-sm leading-relaxed text-paper/70">Timeless proportions and considered finishes make room for changing seasons and changing homes.</p></div>
        </div>
      </section>

      <section className="store-section grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div><p className="eyebrow text-terracotta">At home, slowly</p><h2 className="editorial-heading mt-4 text-4xl sm:text-5xl">A room is never really finished.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">It gathers meaning with every object chosen, every book left open and every place made for someone to stay a little longer.</p><Link to="/collections/living-room" className="eyebrow mt-7 inline-block border-b border-terracotta pb-1 text-terracotta">Explore living room</Link></div>
        <EditorialPhoto src="/images/lifestyle/lounge/lounge-boucle-chair.jpg" alt="Ivory boucle lounge chair in a softly lit reading corner" caption="Room to live, at your own pace" className="min-h-80" />
      </section>

      <section className="store-section border-t border-ink/10">
        <div className="flex flex-wrap items-end justify-between gap-4"><StoreHeading as="h2" eyebrow="A few more favourites" title="Pieces with purpose." /><Link to="/shop" className="eyebrow border-b border-terracotta pb-1 text-terracotta">Shop all</Link></div>
        <div className="mt-8"><ProductGrid products={picks(['soren-dining-chair', 'alma-bed', 'nord-sideboard'])} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" /></div>
      </section>
      <Newsletter />
    </div>
  )
}
