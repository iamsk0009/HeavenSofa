import { useState } from 'react'
import StoreLayout from '../components/StoreLayout'
import { StoreHeading } from '../components/StoreComponents'

export default function Contact() {
  const [status, setStatus] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setStatus('Your form is valid. It has not been sent because this preview has no messaging backend.')
  }
  return (
    <StoreLayout>
      <section className="store-section">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <StoreHeading eyebrow="A conversation begins" title="Get in touch." description="We would be glad to hear what you are looking for. Contact details will be added when the studio is ready to receive enquiries." />
            <dl className="mt-10 grid gap-5 border-t border-ink/10 pt-6 text-sm">
              <div><dt className="eyebrow text-ink/45">Email</dt><dd className="mt-2 text-ink/65">Studio email to be added</dd></div>
              <div><dt className="eyebrow text-ink/45">Phone</dt><dd className="mt-2 text-ink/65">Studio phone to be added</dd></div>
              <div><dt className="eyebrow text-ink/45">Studio</dt><dd className="mt-2 text-ink/65">Address to be announced</dd></div>
              <div><dt className="eyebrow text-ink/45">Social</dt><dd className="mt-2 text-ink/65">Instagram and Pinterest handles to be added</dd></div>
            </dl>
          </div>
          <form onSubmit={submit} className="grid content-start gap-5 border-y border-ink/10 py-7">
            <label className="grid gap-2 text-sm text-ink/70">Your name<input name="name" className="shop-input" required minLength="2" autoComplete="name" /></label>
            <label className="grid gap-2 text-sm text-ink/70">Email address<input name="email" type="email" className="shop-input" required autoComplete="email" /></label>
            <label className="grid gap-2 text-sm text-ink/70">What can we help with?<select name="topic" className="shop-select w-full" defaultValue="Product enquiry"><option>Product enquiry</option><option>Materials and care</option><option>Press and collaboration</option><option>Something else</option></select></label>
            <label className="grid gap-2 text-sm text-ink/70">Message<textarea name="message" className="shop-input min-h-36 resize-y" required minLength="10" /></label>
            <button type="submit" className="eyebrow justify-self-start bg-olive px-7 py-4 text-paper transition-colors hover:bg-ink">Validate message</button>
            <p className="text-xs text-ink/50">This form validates in your browser. It does not send or store your message.</p>
            {status && <p role="status" aria-live="polite" className="border-l-2 border-olive pl-4 text-sm text-olive">{status}</p>}
          </form>
        </div>
      </section>
    </StoreLayout>
  )
}
