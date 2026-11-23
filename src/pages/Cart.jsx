import { Link } from 'react-router-dom'
import CartSummary from '../components/CartSummary'
import { FabricFinishImage } from '../components/FabricFinish'
import StoreLayout from '../components/StoreLayout'
import { Breadcrumbs, formatMoney, SampleNotice, StoreHeading } from '../components/StoreComponents'
import { productBySlug } from '../data/catalog'
import { getFabricFinish } from '../data/fabricFinishes'
import { useShopStore } from '../store/useShopStore'
import ResponsiveImage from '../components/ResponsiveImage'

export default function Cart() {
  const cart = useShopStore((state) => state.cart)
  const setQuantity = useShopStore((state) => state.setQuantity)
  const removeFromCart = useShopStore((state) => state.removeFromCart)
  const lines = cart.map((item) => ({ ...item, product: productBySlug(item.slug) })).filter((item) => item.product)
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <StoreLayout>
      <section className="store-section">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <div className="mt-8"><StoreHeading eyebrow="A considered edit" title="Your cart" description="The pieces you have gathered for a future home." /></div>
        <SampleNotice className="mt-6" />
        {!lines.length ? (
          <div className="mt-12 border-y border-ink/10 py-14 text-center">
            <p className="font-serif text-3xl">Your cart is empty.</p>
            <p className="mt-3 text-sm text-ink/55">Take a look around, and see what feels at home.</p>
            <Link to="/shop" className="eyebrow mt-7 inline-block border-b border-terracotta pb-1 text-terracotta">Continue to the shop</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {lines.map(({ slug, finish: finishId = null, configuration = null, quantity, product }) => {
                const finish = finishId ? getFabricFinish(finishId) : null
                const variantKey = JSON.stringify([slug, finishId, configuration])
                return <article key={variantKey} className="grid grid-cols-[112px_1fr] gap-4 py-5 sm:grid-cols-[160px_1fr_auto] sm:gap-6">
                  <Link to={`/products/${slug}`} className="product-art product-art--product h-28 overflow-hidden bg-limestone/45 sm:h-36">{finish && product.fabricMask
                    ? <FabricFinishImage product={product} finish={finish} alt={`${product.name} in ${finish.name}`} width="1122" height="1402" imageClassName="h-full w-full object-contain" className="h-full w-full" />
                    : <ResponsiveImage src={product.image} alt={`${product.name} in ${product.colour}`} width="1122" height="1402" sizes="112px" loading="lazy" decoding="async" className="h-full w-full object-contain" />}</Link>
                  <div className="flex flex-col justify-between py-1">
                    <div><p className="eyebrow text-ink/45">{product.category}</p><Link to={`/products/${slug}`} className="mt-1 inline-block font-serif text-xl hover:text-terracotta">{product.name}</Link><p className="mt-1 text-sm text-ink/55">{product.material} · {finish ? finish.name : product.colour}</p>{configuration && <p className="mt-2 grid gap-1 text-xs text-ink/55">{Object.entries(configuration).map(([key, value]) => <span key={key}>{key === 'cushionDetails' ? 'Cushion Details' : key}: {typeof value === 'string' ? key === 'cushionDetails' ? value === 'enabled' ? 'Enabled' : 'Disabled' : value : value.label}</span>)}</p>}</div>
                    <button type="button" onClick={() => removeFromCart(slug, finishId, configuration)} className="mt-4 self-start text-xs text-ink/50 underline underline-offset-4 hover:text-terracotta">Remove</button>
                  </div>
                  <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:gap-4">
                    <label className="eyebrow text-ink/50">Qty <select className="shop-select ml-2" value={quantity} onChange={(event) => setQuantity(slug, finishId, Number(event.target.value), configuration)}>{Array.from({ length: 10 }, (_, i) => i + 1).map((amount) => <option key={amount} value={amount}>{amount}</option>)}</select></label>
                    <p className="text-sm">{formatMoney(product.price * quantity)}</p>
                  </div>
                </article>
              })}
            </div>
            <div><CartSummary subtotal={subtotal} /><Link to="/shop" className="eyebrow mt-5 block text-center text-terracotta">Continue shopping</Link></div>
          </div>
        )}
      </section>
    </StoreLayout>
  )
}
