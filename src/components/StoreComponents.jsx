import { Link } from 'react-router-dom'
import { useShopStore } from '../store/useShopStore'
import ResponsiveImage from './ResponsiveImage'

export const formatMoney = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(amount)

export function SampleNotice({ className = '' }) {
  return <p className={`sample-notice ${className}`}>Concept catalogue · Product details, prices and availability are illustrative. No live inventory or payment service is connected.</p>
}

export function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap items-center gap-2 text-ink/45">
      <Link to="/" className="hover:text-terracotta">Home</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {item.to ? <Link to={item.to} className="hover:text-terracotta">{item.label}</Link> : <span aria-current="page" className="text-ink/70">{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function ProductCard({ product, compact = false }) {
  const wished = useShopStore((state) => state.wishlist.includes(product.slug))
  const toggleWishlist = useShopStore((state) => state.toggleWishlist)
  return (
    <article className="group min-w-0">
      <div className="product-art product-art--product relative overflow-hidden bg-limestone/45">
        <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="block h-full">
          <ResponsiveImage src={product.image} alt={`${product.name} in ${product.colour}`} width="1122" height="1402" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]" />
        </Link>
        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-paper/90 text-xl text-ink transition-colors hover:bg-paper hover:text-terracotta"
        >{wished ? '♥' : '♡'}</button>
        {!compact && <p className="absolute bottom-3 left-3 eyebrow bg-paper/80 px-2 py-1 text-ink/65">{product.category}</p>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/products/${product.slug}`} className="font-serif text-xl text-ink transition-colors hover:text-terracotta">{product.name}</Link>
          <p className="mt-1 text-sm text-ink/55">{product.material} · {product.colour}</p>
        </div>
        <p className="shrink-0 text-sm text-ink/75">{formatMoney(product.price)}</p>
      </div>
    </article>
  )
}

export function ProductGrid({ products, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }) {
  if (!products.length) return <div className="border-y border-ink/10 py-16 text-center"><h2 className="font-serif text-3xl">No pieces found</h2><p className="mt-3 text-sm text-ink/55">Try a different search or clear some filters.</p></div>
  return <div className={`grid ${columns} gap-x-5 gap-y-12 md:gap-x-8`}>{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
}

export function CollectionCard({ collection }) {
  const first = collection.products[0]
  return (
    <Link to={`/collections/${collection.slug}`} className="group block">
      <div className="product-art product-art--lifestyle overflow-hidden bg-limestone/45">
        <ResponsiveImage src={collection.image} alt={`${collection.title} interior`} width="1536" height="1024" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div><h3 className="font-serif text-2xl">{collection.title}</h3><p className="mt-1 text-sm text-ink/55">{collection.products.length} considered pieces</p></div>
        <span className="eyebrow border-b border-terracotta pb-1 text-terracotta">Explore</span>
      </div>
      {first && <span className="sr-only">Featuring {first}</span>}
    </Link>
  )
}

export function StoreHeading({ eyebrow, title, description, align = 'left', as = 'h1' }) {
  const Heading = as
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && <p className="eyebrow text-terracotta">{eyebrow}</p>}
      <Heading className="editorial-heading mt-4 text-[clamp(2.8rem,7vw,6rem)]">{title}</Heading>
      {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65">{description}</p>}
    </div>
  )
}
