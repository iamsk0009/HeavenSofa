import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StoreLayout from '../components/StoreLayout'
import { FabricFinishImage, FabricFinishSelector } from '../components/FabricFinish'
import { Breadcrumbs, formatMoney, ProductGrid, SampleNotice, StoreHeading } from '../components/StoreComponents'
import { PRODUCTS, productBySlug, productImagesForColour } from '../data/catalog'
import { DEFAULT_FABRIC_FINISH, getFabricFinish, isFinishableProduct } from '../data/fabricFinishes'
import { useShopStore } from '../store/useShopStore'

const colourFabric = { Oat: '#D9C7AA', Moss: '#87917B', Clay: '#B86C52', Ivory: '#E5DED2', Walnut: '#795A42', Natural: '#B4865A', Smoked: '#765B45', Sand: '#C8BBA8', 'Natural oak': '#B4865A', Chalk: '#D8D0C2', Sage: '#AAB59A' }

export default function ProductDetail() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  const finishEnabled = isFinishableProduct(slug)
  const addToCart = useShopStore((state) => state.addToCart)
  const toggleWishlist = useShopStore((state) => state.toggleWishlist)
  const wished = useShopStore((state) => state.wishlist.includes(slug))
  const [colour, setColour] = useState(product?.colours?.[0] ?? product?.colour ?? '')
  const [selectedFinish, setSelectedFinish] = useState(DEFAULT_FABRIC_FINISH)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [view, setView] = useState(0)
  const related = useMemo(() => product ? PRODUCTS.filter((item) => item.slug !== product.slug && (item.category === product.category || item.material === product.material)).slice(0, 3) : [], [product])

  useEffect(() => {
    setColour(product?.colours?.[0] ?? product?.colour ?? '')
    setSelectedFinish(DEFAULT_FABRIC_FINISH)
    setView(0)
    setMessage('')
  }, [slug])

  if (!product) return <StoreLayout><section className="store-section"><Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: 'Piece not found' }]} /><div className="mt-12"><StoreHeading eyebrow="A little detour" title="This piece has moved." description="Browse the collection to find something that feels right." /><Link to="/shop" className="mt-8 inline-block border-b border-terracotta pb-1 text-sm text-terracotta">Return to the shop</Link></div></section></StoreLayout>

  const add = () => {
    addToCart(product.slug, quantity, finishEnabled ? selectedFinish : null)
    const finishLabel = finishEnabled ? ` in ${getFabricFinish(selectedFinish).name}` : ''
    setMessage(`${quantity} × ${product.name}${finishLabel} added to your sample cart.`)
  }
  const { images, available: colourImagesAvailable, fallbackColour } = productImagesForColour(product, colour)
  const galleryViews = [
    { label: 'Three-quarter', src: images.threeQuarter, alt: `${product.name} in ${colour}, three-quarter studio view`, fit: 'product', dimensions: '1122 1402' },
    ...(product.alternateImage || product.variants?.some((variant) => variant.images.front) ? [{ label: 'Front', src: images.front, alt: `${product.name} in ${colour}, direct front studio view`, fit: 'product', dimensions: '1122 1402' }] : []),
    { label: 'Material', src: images.material, alt: `${product.material} detail for ${product.name} in ${colour}`, fit: 'detail', dimensions: '1536 1024' },
    { label: 'In a room', src: images.lifestyle, alt: `${product.name} in ${colour}, styled in a ${product.category.toLowerCase()} interior`, fit: 'room', dimensions: '1536 1024' },
  ]
  const activeGalleryView = galleryViews[view] ?? galleryViews[0]

  return (
    <StoreLayout>
      <section className="store-section">
        <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` }, { label: product.name }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <div className={`product-gallery product-art overflow-hidden bg-limestone/45 product-gallery--${activeGalleryView.fit}`}>
              {finishEnabled && view === 0 ? <FabricFinishImage
                product={product}
                finish={getFabricFinish(selectedFinish)}
                alt={activeGalleryView.alt}
                width="1122"
                height="1402"
                loading={view === 0 ? 'eager' : 'lazy'}
                className="h-full w-full"
                imageClassName="product-gallery-image"
              /> : <img
                src={activeGalleryView.src}
                alt={activeGalleryView.alt}
                width={activeGalleryView.dimensions.split(' ')[0]}
                height={activeGalleryView.dimensions.split(' ')[1]}
                fetchPriority={view === 0 ? 'high' : undefined}
                loading={view === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="product-gallery-image"
              />}
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-3" role="group" aria-label="Product image views">
              {galleryViews.map((item, index) => <button type="button" key={item.label} onClick={() => setView(index)} aria-pressed={view === index} className={`gallery-thumb ${view === index ? 'gallery-thumb--active' : ''}`}>
                <img src={item.src} alt={`${item.alt} thumbnail`} width={item.dimensions.split(' ')[0]} height={item.dimensions.split(' ')[1]} loading="lazy" decoding="async" />
                <span>{item.label}</span>
              </button>)}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-terracotta">{product.category} · {product.material}</p>
            <h1 className="editorial-heading mt-4 text-[clamp(2.6rem,5vw,4.8rem)]">{product.name}</h1>
            <p className="mt-5 text-lg text-ink/75">{formatMoney(product.price)}</p>
            <SampleNotice className="mt-4" />
            <p className="mt-7 text-base leading-relaxed text-ink/70">{product.description}</p>

            {finishEnabled ? <FabricFinishSelector selected={selectedFinish} onSelect={(id) => { setSelectedFinish(id); setView(0) }} /> : <div className="mt-8">
              <p className="eyebrow mb-3 text-ink/65">Colour · {colour}</p>
              <div className="flex flex-wrap gap-3">
                {(product.colours ?? [product.colour]).map((item) => <button key={item} type="button" onClick={() => { setColour(item); setView(0) }} aria-pressed={colour === item} aria-label={`Select ${item}`} className={`h-10 w-10 rounded-full border-2 ${colour === item ? 'border-terracotta' : 'border-paper'}`} style={{ backgroundColor: colourFabric[item] ?? product.fabric }} />)}
              </div>
              {!colourImagesAvailable && <p role="status" aria-live="polite" className="mt-3 text-xs leading-relaxed text-terracotta">Dedicated {colour} images are not available yet. Showing this piece’s {fallbackColour} gallery until matching images are added.</p>}
            </div>}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="product-quantity">Quantity</label>
              <select id="product-quantity" className="shop-select" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: 10 }, (_, i) => i + 1).map((amount) => <option key={amount} value={amount}>{amount}</option>)}</select>
              <button type="button" onClick={add} className="eyebrow flex-1 bg-olive px-6 py-4 text-paper transition-colors hover:bg-ink">Add to sample cart</button>
              <button type="button" aria-pressed={wished} onClick={() => toggleWishlist(product.slug)} className="eyebrow border border-ink/20 px-5 py-4 text-ink transition-colors hover:border-terracotta hover:text-terracotta">{wished ? '♥ Saved' : '♡ Save'}</button>
            </div>
            <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-olive">{message}</p>
            <Link to={`/configurator?product=${product.slug}`} className="mt-3 inline-block border-b border-terracotta pb-1 text-sm text-terracotta">Explore a future custom finish</Link>

            <details className="store-details mt-8" open><summary>Dimensions &amp; specifications</summary><p className="mt-4 text-sm text-ink/65">{product.dimensions}</p><ul className="mt-3 grid gap-2 text-sm text-ink/65">{product.specifications.map((spec) => <li key={spec}>— {spec}</li>)}</ul></details>
            <details className="store-details"><summary>Delivery &amp; care</summary><p className="mt-4 text-sm leading-relaxed text-ink/65">Delivery timing and care guidance would be confirmed by a connected commerce service. No live fulfilment data is available in this sample catalogue.</p></details>
          </div>
        </div>

        {related.length > 0 && <div className="mt-20 border-t border-ink/10 pt-12"><StoreHeading eyebrow="Consider alongside" title="Related pieces" /><div className="mt-8"><ProductGrid products={related} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" /></div></div>}
      </section>
    </StoreLayout>
  )
}
