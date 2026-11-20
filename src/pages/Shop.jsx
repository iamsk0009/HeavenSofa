import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/catalog'
import { ProductGrid, SampleNotice, StoreHeading } from '../components/StoreComponents'
import StoreLayout from '../components/StoreLayout'

const MATERIALS = [...new Set(PRODUCTS.map((product) => product.material))].sort()
const COLOURS = [...new Set(PRODUCTS.map((product) => product.colour))].sort()

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? 'All categories')
  const [material, setMaterial] = useState('All materials')
  const [colour, setColour] = useState('All colours')
  const [availability, setAvailability] = useState('Any availability')
  const [maxPrice, setMaxPrice] = useState(150000)
  const [sort, setSort] = useState(params.get('sort') ?? 'featured')

  const result = useMemo(() => {
    const needle = (params.get('q') ?? '').trim().toLowerCase()
    const items = PRODUCTS.filter((product) => {
      const matchesQuery = !needle || [product.name, product.category, product.material, product.colour, product.description].some((value) => value.toLowerCase().includes(needle))
      return matchesQuery
        && (category === 'All categories' || product.category === category)
        && (material === 'All materials' || product.material === material)
        && (colour === 'All colours' || product.colour === colour)
        && (availability === 'Any availability' || product.availability === availability)
        && product.price <= maxPrice
    })
    return items.sort((a, b) => {
      if (sort === 'newest') return b.year - a.year || a.featured - b.featured
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return a.featured - b.featured
    })
  }, [params, category, material, colour, availability, maxPrice, sort])

  const submitSearch = (event) => {
    event.preventDefault()
    const next = new URLSearchParams(params)
    if (query.trim()) next.set('q', query.trim())
    else next.delete('q')
    setParams(next)
  }
  const clearFilters = () => {
    setCategory('All categories')
    setMaterial('All materials')
    setColour('All colours')
    setAvailability('Any availability')
    setMaxPrice(150000)
    setSort('featured')
    setQuery('')
    setParams({})
  }

  return (
    <StoreLayout>
      <section className="store-section">
        <StoreHeading eyebrow="The collection" title="Furniture for a life well lived." description="Thoughtful forms, honest materials and the small details that make a room feel like yours." />
        <SampleNotice className="mt-6" />

        <div className="mt-10 grid gap-6 border-y border-ink/10 py-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <form onSubmit={submitSearch} className="flex max-w-xl gap-3">
            <label className="sr-only" htmlFor="catalog-search">Search products</label>
            <input id="catalog-search" className="shop-input min-w-0 flex-1" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, material or category" />
            <button type="submit" className="eyebrow border-b border-terracotta px-2 text-terracotta">Search</button>
          </form>
          <label className="flex items-center gap-3 text-sm text-ink/65">Sort by
            <select className="shop-select" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="my-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="filter-label">Category<select className="shop-select mt-2 w-full" value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="filter-label">Material<select className="shop-select mt-2 w-full" value={material} onChange={(event) => setMaterial(event.target.value)}><option>All materials</option>{MATERIALS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="filter-label">Colour<select className="shop-select mt-2 w-full" value={colour} onChange={(event) => setColour(event.target.value)}><option>All colours</option>{COLOURS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="filter-label">Availability<select className="shop-select mt-2 w-full" value={availability} onChange={(event) => setAvailability(event.target.value)}><option>Any availability</option><option>Made to order</option><option>In studio</option></select></label>
          <label className="filter-label">Maximum price <span className="normal-case tracking-normal">₹{maxPrice.toLocaleString('en-IN')}</span><input className="mt-3 w-full accent-terracotta" type="range" min="5000" max="150000" step="5000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum price" /></label>
        </div>

        <div className="mb-7 flex items-center justify-between gap-4">
          <p className="text-sm text-ink/60">{result.length} {result.length === 1 ? 'piece' : 'pieces'}{params.get('q') && <> for “{params.get('q')}”</>}</p>
          <button type="button" className="eyebrow text-terracotta hover:text-ink" onClick={clearFilters}>Clear filters</button>
        </div>
        <ProductGrid products={result} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        <div className="mt-16 border-t border-ink/10 pt-6 text-sm text-ink/55">Designed to be lived with. <Link to="/collections" className="underline decoration-terracotta underline-offset-4">Browse by collection</Link></div>
      </section>
    </StoreLayout>
  )
}
