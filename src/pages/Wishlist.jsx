import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/catalog'
import { ProductGrid, SampleNotice, StoreHeading } from '../components/StoreComponents'
import StoreLayout from '../components/StoreLayout'
import { useShopStore } from '../store/useShopStore'

export default function Wishlist() {
  const wishlist = useShopStore((state) => state.wishlist)
  const products = PRODUCTS.filter((product) => wishlist.includes(product.slug))
  return (
    <StoreLayout>
      <section className="store-section">
        <StoreHeading eyebrow="Kept close" title="Your wishlist" description="A place for the pieces you would like to return to." />
        <SampleNotice className="mt-6" />
        {products.length ? <div className="mt-10"><ProductGrid products={products} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" /></div> : (
          <div className="mt-12 border-y border-ink/10 py-14 text-center">
            <p className="font-serif text-3xl">Nothing saved just yet.</p>
            <p className="mt-3 text-sm text-ink/55">Use the heart on any piece to keep it here.</p>
            <Link to="/shop" className="eyebrow mt-7 inline-block border-b border-terracotta pb-1 text-terracotta">Explore the collection</Link>
          </div>
        )}
      </section>
    </StoreLayout>
  )
}
