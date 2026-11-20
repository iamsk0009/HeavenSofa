import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartSummary from '../components/CartSummary'
import StoreLayout from '../components/StoreLayout'
import { Breadcrumbs, formatMoney, SampleNotice, StoreHeading } from '../components/StoreComponents'
import { productBySlug } from '../data/catalog'
import { getFabricFinish } from '../data/fabricFinishes'
import { useShopStore } from '../store/useShopStore'

const Field = ({ label, name, ...props }) => (
  <label className="grid gap-2 text-sm text-ink/70">{label}<input className="shop-input" name={name} {...props} /></label>
)

export default function Checkout() {
  const cart = useShopStore((state) => state.cart)
  const lines = cart.map((item) => ({ ...item, product: productBySlug(item.slug) })).filter((item) => item.product)
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const [reviewed, setReviewed] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setReviewed(true)
  }

  return (
    <StoreLayout>
      <section className="store-section">
        <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <div className="mt-8"><StoreHeading eyebrow="A sample checkout" title="Delivery details" description="Add your details to review this sample order." /></div>
        <SampleNotice className="mt-6" />
        {!lines.length ? <div className="mt-10 border-y border-ink/10 py-12"><p className="font-serif text-2xl">There are no pieces to check out.</p><Link to="/shop" className="mt-4 inline-block text-sm text-terracotta underline">Browse the collection</Link></div> : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
            <form onSubmit={submit} className="grid content-start gap-8" noValidate={false}>
              <fieldset className="grid gap-5">
                <legend className="eyebrow mb-4 text-ink/55">Your details</legend>
                <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" name="name" autoComplete="name" required minLength="2" /><Field label="Email address" name="email" type="email" autoComplete="email" required /></div>
                <Field label="Phone number" name="phone" type="tel" autoComplete="tel" pattern="[0-9+() -]{7,20}" title="Enter 7 to 20 digits or phone punctuation." required />
              </fieldset>
              <fieldset className="grid gap-5">
                <legend className="eyebrow mb-4 text-ink/55">Delivery address</legend>
                <Field label="Address" name="address" autoComplete="street-address" required minLength="5" />
                <div className="grid gap-5 sm:grid-cols-2"><Field label="City" name="city" autoComplete="address-level2" required /><Field label="State" name="state" autoComplete="address-level1" required /></div>
                <div className="grid gap-5 sm:grid-cols-2"><Field label="Postal code" name="postalCode" autoComplete="postal-code" pattern="[A-Za-z0-9 -]{3,12}" title="Enter a valid postal code." required /><label className="grid gap-2 text-sm text-ink/70">Country<select className="shop-select w-full" name="country" defaultValue="India"><option>India</option><option>Other</option></select></label></div>
              </fieldset>
              <div className="border-y border-ink/10 py-5"><p className="eyebrow text-ink/55">Shipping</p><p className="mt-2 text-sm leading-relaxed text-ink/65">Delivery timing and charges are illustrative in this demo and would be confirmed before a real order.</p></div>
              <div className="border border-ink/10 bg-limestone/25 p-5"><p className="eyebrow text-ink/55">Payment</p><p className="mt-2 text-sm leading-relaxed text-ink/65">Payment is not connected in this phase. Reviewing this sample checkout does not place an order or collect payment.</p></div>
              <button type="submit" className="eyebrow justify-self-start bg-olive px-7 py-4 text-paper transition-colors hover:bg-ink">Review sample order</button>
              {reviewed && <p role="status" aria-live="polite" className="border-l-2 border-olive pl-4 text-sm leading-relaxed text-olive">Your details passed the form checks. This is a frontend preview only; no order was placed and no payment was collected.</p>}
            </form>
            <div>
              <aside className="cart-summary">
                <p className="eyebrow text-ink/55">Your pieces</p>
                <ul className="mt-5 grid gap-4">
                  {lines.map(({ slug, finish: finishId = null, configuration = null, quantity, product }) => <li key={JSON.stringify([slug, finishId, configuration])} className="flex justify-between gap-4 text-sm"><span>{product.name}{finishId && <span className="block text-xs text-ink/50">Finish · {getFabricFinish(finishId).name}</span>}{configuration && <span className="mt-1 grid text-xs text-ink/50">{Object.entries(configuration).map(([key, value]) => <span key={key}>{key === 'pillowDetail' ? 'Pillow detail' : key}: {typeof value === 'string' ? value === 'included' ? 'Included' : 'Removed' : value.label}</span>)}</span>} <span className="text-ink/45">× {quantity}</span></span><span className="shrink-0">{formatMoney(product.price * quantity)}</span></li>)}
                </ul>
                <div className="mt-5 border-t border-ink/10 pt-5"><CartSummary subtotal={subtotal} checkout /></div>
              </aside>
              <Link to="/cart" className="eyebrow mt-5 block text-center text-terracotta">Return to cart</Link>
            </div>
          </div>
        )}
      </section>
    </StoreLayout>
  )
}
