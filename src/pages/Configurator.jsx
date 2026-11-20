import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ConfiguratorViewer from '../components/ConfiguratorViewer'
import { CONFIGURATOR_PRODUCTS, CONFIGURATOR_TABS, createInitialConfiguratorSelections, createResetConfiguratorSelections, MATERIAL_OPTIONS, selectionsForProduct } from '../data/configuratorProducts'
import { formatMoney } from '../components/StoreComponents'
import { useShopStore } from '../store/useShopStore'

const optionFor = (component, color) => MATERIAL_OPTIONS[component.kind]?.find((option) => option.color === color)

function Swatch({ option, selected, onClick }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} aria-label={option.label} title={option.label} className={`config-swatch ${selected ? 'config-swatch--selected' : ''}`}>
    <span style={{ backgroundColor: option.color }} />
    <small>{option.label}</small>
  </button>
}

function PillowDetailControl({ selected, onSelect, compact = false }) {
  if (compact) return <section className="config-pillow-detail config-pillow-detail--compact" aria-label="Pillow Detail">
    <span className="config-pillow-detail__compact-label">Pillow detail</span>
    <div className="config-pillow-choices" role="group" aria-label="Pillow Detail">
      {['included', 'removed'].map((value) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)}>{value === 'included' ? 'Included' : 'Removed'}</button>)}
    </div>
  </section>
  return <section className="config-pillow-detail" aria-labelledby="pillow-detail-title">
    <div><p className="eyebrow">Structure option</p><h2 id="pillow-detail-title">Pillow Detail</h2><p>Show or remove the original accent pillow.</p></div>
    <div className="config-pillow-choices" role="group" aria-label="Pillow Detail">
      {['included', 'removed'].map((value) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)}>{value === 'included' ? 'Included' : 'Removed'}</button>)}
    </div>
  </section>
}

export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const requestedSlug = params.get('product')
  const product = CONFIGURATOR_PRODUCTS.find((item) => item.slug === requestedSlug) ?? CONFIGURATOR_PRODUCTS[0]
  const [tab, setTab] = useState('Materials')
  const [selectionState, setSelectionState] = useState(() => ({ slug: product.slug, values: createInitialConfiguratorSelections(product) }))
  const selections = selectionsForProduct(selectionState, product)
  const [cameraCommand, setCameraCommand] = useState(null)
  const [notice, setNotice] = useState('')
  const addToCart = useShopStore((state) => state.addToCart)
  const modelComponents = useMemo(() => product.components, [product])

  useEffect(() => {
    if (requestedSlug !== product.slug) setParams({ product: product.slug }, { replace: true })
    setSelectionState({ slug: product.slug, values: createInitialConfiguratorSelections(product) })
    setTab('Materials')
    setNotice('')
  }, [product.slug])

  const updateSelections = (update) => setSelectionState((current) => {
    const values = selectionsForProduct(current, product)
    return { slug: product.slug, values: typeof update === 'function' ? update(values) : update }
  })

  const configText = modelComponents.map((component) => {
    const choice = MATERIAL_OPTIONS[component.kind]?.find((item) => item.color === selections[component.id])
    return `${component.label}: ${choice?.label ?? 'Original'}`
  })
  if (product.slug === 'linnea-sofa') configText.push(`Pillow detail: ${selections.pillowDetail === 'removed' ? 'Removed' : 'Included'}`)

  const saveDesign = () => {
    try {
      const key = 'heaven-co-configurator-designs'
      const saved = JSON.parse(localStorage.getItem(key) || '[]')
      saved.unshift({ id: `${product.slug}-${Date.now()}`, slug: product.slug, selections, savedAt: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(saved.slice(0, 20)))
      setNotice('Design saved in this browser.')
    } catch {
      setNotice('This browser could not save the design.')
    }
  }

  const add = () => {
    const selectedFabric = MATERIAL_OPTIONS.fabric.find((option) => option.color === selections.upholstery)?.id ?? 'sand'
    const savedConfiguration = Object.fromEntries(product.components.flatMap((component) => {
      const color = selections[component.id]
      const option = MATERIAL_OPTIONS[component.kind]?.find((item) => item.color === color)
      return color && option ? [[component.label, { label: option.label, color }]] : []
    }))
    if (product.slug === 'linnea-sofa') savedConfiguration.pillowDetail = selections.pillowDetail === 'removed' ? 'removed' : 'included'
    addToCart(product.slug, 1, ['linnea-sofa', 'alma-bed'].includes(product.slug) ? selectedFabric : null, savedConfiguration)
    setNotice(`${product.name} added to your sample cart.`)
  }

  return <main className="configurator-page">
    <header className="configurator-topbar">
      <Link to="/" className="configurator-wordmark">HEAVEN &amp; CO.</Link>
      <div className="configurator-current"><span className="eyebrow">Furniture · Interiors · Living</span><strong>{product.name}</strong></div>
      <div className="configurator-top-actions">
        <button type="button" onClick={saveDesign}>Save design</button>
        <Link to={`/products/${product.slug}`}>Exit configurator</Link>
      </div>
    </header>

    <section className="configurator-workspace">
      <div className="configurator-stage-column">
        <div className="configurator-product-picker">
          <label htmlFor="configurator-product" className="eyebrow">Configure a piece</label>
          <select id="configurator-product" value={product.slug} onChange={(event) => setParams({ product: event.target.value })}>
            {CONFIGURATOR_PRODUCTS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <span className={`configurator-model-state ${product.model ? 'is-supported' : ''}`}>{product.model ? '3D model ready' : '3D customization unavailable'}</span>
        </div>

        <div className="configurator-stage">
          <ConfiguratorViewer product={product} selections={selections} command={cameraCommand} />
          {product.model && <div className="configurator-view-controls" aria-label="3D viewer controls">
            <button type="button" onClick={() => setCameraCommand({ type: 'front', id: Date.now() })} aria-label="Front view">Front</button>
            <button type="button" onClick={() => setCameraCommand({ type: 'side', id: Date.now() })} aria-label="Side view">Side</button>
            <button type="button" onClick={() => setCameraCommand({ type: 'rear', id: Date.now() })} aria-label="Rear view">Rear</button>
            <span aria-hidden="true" />
            <button type="button" onClick={() => setCameraCommand({ type: 'zoom-out', id: Date.now() })} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => setCameraCommand({ type: 'zoom-in', id: Date.now() })} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => setCameraCommand({ type: 'reset', id: Date.now() })} aria-label="Reset camera">Reset</button>
          </div>}
          {product.model && <p className="configurator-drag-hint">Drag to rotate · Scroll to zoom</p>}
        </div>
      </div>

      <aside className="configurator-panel">
        <div className="configurator-panel-heading">
          <p className="eyebrow text-terracotta">A beautiful way to live</p>
          <h1>{product.name}</h1>
          <p>{product.short}</p>
        </div>
        <nav className="configurator-tabs" aria-label="Configuration sections">
          {CONFIGURATOR_TABS.map((item) => <button type="button" key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)} aria-current={tab === item ? 'page' : undefined}>{item}</button>)}
        </nav>

        <div className="configurator-panel-content" key={`${product.slug}-${tab}`}>
          {tab === 'Materials' && <div className="config-material-sections">
            {product.model && product.components.length > 0 && <button type="button" className="config-reset-materials" onClick={() => updateSelections(createResetConfiguratorSelections(product))}>Restore original material colors</button>}
            {!product.model && <div className="config-notice"><p className="eyebrow">3D customization unavailable</p><p>{product.modelNote}</p></div>}
            {product.components.map((component) => <section className="config-material-group" key={component.id}>
              <div className="config-section-title"><h2>{component.label}</h2><span>{optionFor(component, selections[component.id])?.label ?? 'Original material'}</span></div>
              <div className="config-swatches">
                {(MATERIAL_OPTIONS[component.kind] ?? []).map((option) => <Swatch key={option.id} option={option} selected={selections[component.id] === option.color} onClick={() => updateSelections((current) => ({ ...current, [component.id]: option.color }))} />)}
              </div>
              <p className="config-capability">Changes the model’s <strong>{component.materials.join(', ')}</strong> material group.</p>
              {product.slug === 'linnea-sofa' && component.id === 'accent' && <PillowDetailControl compact selected={selections.pillowDetail} onSelect={(value) => updateSelections((current) => ({ ...current, pillowDetail: value }))} />}
            </section>)}
            {product.model && product.components.length === 0 && <p className="text-sm text-ink/60">No independently customizable material slots were found for this model.</p>}
          </div>}

          {tab === 'Structure' && <div className="config-info-list">
            <p className="eyebrow">Model components</p>
            {product.model ? <>
              <p className="text-sm leading-relaxed text-ink/65">The viewer exposes only the named mesh groups found in this model. Geometry-changing options are not available in the supplied asset.</p>
              {product.slug === 'linnea-sofa' && <PillowDetailControl selected={selections.pillowDetail} onSelect={(value) => updateSelections((current) => ({ ...current, pillowDetail: value }))} />}
              <ul>{product.meshes.map((mesh) => <li key={mesh}><span>{mesh}</span><span>Present</span></li>)}</ul>
              <p className="config-capability">Separate cushion or structural variants require additional model geometry.</p>
            </> : <div className="config-notice"><p>No matching 3D model is available to inspect or customize.</p></div>}
          </div>}

          {tab === 'Dimensions' && <div className="config-info-list">
            <p className="eyebrow">Catalogue dimensions</p>
            <p className="config-dimensions">{product.dimensions}</p>
            <p className="text-sm leading-relaxed text-ink/65">These are the published product dimensions. This configurator does not resize the model or imply unsupported size variants.</p>
            <ul>{product.specifications.map((spec) => <li key={spec}><span>{spec}</span></li>)}</ul>
          </div>}

          {tab === 'Summary' && <div className="config-info-list">
            <p className="eyebrow">Your selected details</p>
            <h2 className="config-summary-name">{product.name}</h2>
            <ul>{(configText.length ? configText : ['No material options available without a matching 3D model']).map((line) => <li key={line}><span>{line}</span></li>)}</ul>
            <div className="config-summary-dimensions"><span>Dimensions</span><strong>{product.dimensions}</strong></div>
          </div>}
        </div>
        <div className="configurator-panel-foot"><span>Furniture · Interiors · Living</span><span>{CONFIGURATOR_PRODUCTS.findIndex((item) => item.slug === product.slug) + 1} / 7</span></div>
      </aside>
    </section>

    <footer className="configurator-purchase">
      <div><span className="eyebrow">Selected piece</span><strong>{product.name}</strong><small>{configText.join(' · ') || (product.model ? 'Original model materials' : '3D model unavailable')}</small></div>
      <p className="configurator-price">{formatMoney(product.price)}</p>
      <button type="button" onClick={add}>Add to sample cart</button>
    </footer>
    <div role="status" aria-live="polite" className="configurator-toast">{notice}</div>
  </main>
}
