import { Link, useParams } from 'react-router-dom'
import StoreLayout from '../components/StoreLayout'
import { Breadcrumbs, ProductGrid, SampleNotice, StoreHeading } from '../components/StoreComponents'
import { collectionBySlug, productBySlug } from '../data/catalog'
import ResponsiveImage from '../components/ResponsiveImage'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = collectionBySlug(slug)
  if (!collection) return <StoreLayout><section className="store-section"><StoreHeading eyebrow="Collection" title="This collection is taking shape." description="Explore all of our considered pieces while we prepare this edit." /><Link className="mt-8 inline-block text-terracotta underline" to="/collections">All collections</Link></section></StoreLayout>
  const products = collection.products.map(productBySlug).filter(Boolean)
  return (
    <StoreLayout>
      <section className="store-section">
        <Breadcrumbs items={[{ label: 'Collections', to: '/collections' }, { label: collection.title }]} />
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div><StoreHeading eyebrow="Collection" title={collection.title} description={collection.description} /><p className="mt-5 text-sm text-ink/50">{products.length} considered pieces</p></div>
          <div className="product-art product-art--lifestyle overflow-hidden bg-limestone/45"><ResponsiveImage src={collection.image} alt={`${collection.title} interior`} width="1536" height="1024" sizes="(min-width: 1024px) 55vw, 100vw" fetchPriority="high" decoding="async" className="h-full w-full object-cover" /></div>
        </div>
        <SampleNotice className="mt-6" />
        <div className="mt-14"><ProductGrid products={products} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" /></div>
      </section>
    </StoreLayout>
  )
}
