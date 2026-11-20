import { COLLECTIONS } from '../data/catalog'
import { CollectionCard, SampleNotice, StoreHeading } from '../components/StoreComponents'
import StoreLayout from '../components/StoreLayout'

export default function Collections() {
  return (
    <StoreLayout>
      <section className="store-section">
        <StoreHeading eyebrow="A room at a time" title="Collections" description="Each collection begins with a way of living: unhurried, open, and shaped by the materials around us." />
        <SampleNotice className="mt-6" />
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((collection) => <CollectionCard key={collection.slug} collection={collection} />)}
        </div>
      </section>
    </StoreLayout>
  )
}
