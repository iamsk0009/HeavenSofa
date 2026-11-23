import { Link } from 'react-router-dom'
import StoreLayout from '../components/StoreLayout'
import { StoreHeading } from '../components/StoreComponents'
import ResponsiveImage from '../components/ResponsiveImage'

const VALUES = [
  ['Designed with restraint', 'We begin with the room around a piece: its light, its proportions and the way people move through it. The result is considered rather than loud.'],
  ['Made to be lived with', 'Natural timber, tactile cloth and repairable construction give each design a long life beyond a single season.'],
  ['Craft in the details', 'Quiet joinery, hand-finished edges and thoughtful material choices are the details that make a piece feel resolved.'],
]

export default function About() {
  return (
    <StoreLayout>
      <section className="store-section">
        <StoreHeading eyebrow="A beautiful way to live" title={<>Objects for <span className="accent">everyday</span> rituals.</>} description="HEAVEN & CO. is an independent furniture concept shaped by architecture, natural materials and the belief that home should make space to breathe." />
        <div className="mt-14 grid items-stretch gap-7 lg:grid-cols-2">
          <ResponsiveImage src="/images/lifestyle/homepage/heaven-homepage-living.jpg" alt="Quiet, sunlit interior with linen upholstery and oak furniture" width="1536" height="1024" sizes="(min-width: 1024px) 50vw, 100vw" fetchPriority="high" decoding="async" className="about-story-image h-full min-h-72 w-full object-cover" />
          <div className="flex flex-col justify-end bg-limestone/35 p-7 sm:p-12">
            <p className="max-w-lg font-serif text-3xl leading-tight sm:text-5xl">A quieter kind of permanence, built one considered piece at a time.</p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ink/65">From the first timber sketch to the last stitch, our design language looks for balance: between softness and structure, utility and warmth, form and feeling.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-9 md:grid-cols-3">
          {VALUES.map(([title, body], index) => <article key={title} className="border-t border-ink/15 pt-5"><p className="eyebrow text-terracotta">0{index + 1}</p><h2 className="mt-4 font-serif text-2xl">{title}</h2><p className="mt-3 text-sm leading-relaxed text-ink/65">{body}</p></article>)}
        </div>
        <figure className="editorial-photo mt-16 min-h-64">
          <ResponsiveImage src="/images/lifestyle/craftsmanship/craft-oak-chair.jpg" alt="Craftsperson hand-sanding a curved oak chair rail" width="1536" height="1024" sizes="(min-width: 1024px) 50vw, 100vw" loading="lazy" decoding="async" />
          <figcaption>Care in every grain, curve and join</figcaption>
        </figure>
        <div className="mt-16 flex flex-col gap-5 border-t border-ink/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow text-terracotta">Explore the collection</p><h2 className="mt-2 font-serif text-3xl">Find a piece for your place.</h2></div>
          <Link to="/collections" className="eyebrow border-b border-terracotta pb-1 text-terracotta">Browse collections</Link>
        </div>
      </section>
    </StoreLayout>
  )
}
