import { Link } from 'react-router-dom'
import { formatMoney } from './StoreComponents'

export default function CartSummary({ subtotal, checkout = false }) {
  const shipping = 0
  return (
    <aside className="cart-summary">
      <p className="eyebrow text-ink/55">Order summary</p>
      <div className="mt-5 flex justify-between text-sm"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
      <div className="mt-3 flex justify-between text-sm"><span>Shipping estimate</span><span>₹0 · demo</span></div>
      <div className="mt-5 flex justify-between border-t border-ink/10 pt-5 font-serif text-xl"><span>Total</span><span>{formatMoney(subtotal + shipping)}</span></div>
      <p className="mt-4 text-xs leading-relaxed text-ink/50">Illustrative total only. Shipping, tax and final pricing require a live commerce service.</p>
      {!checkout && <Link to="/checkout" className="eyebrow mt-6 block bg-olive px-5 py-4 text-center text-paper transition-colors hover:bg-ink">Continue to checkout</Link>}
    </aside>
  )
}
