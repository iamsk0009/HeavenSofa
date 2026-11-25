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

function CushionDetailsControl({ selected, onSelect, compact = false }) {
  if (compact) return <section className="config-cushion-details config-cushion-details--compact" aria-label="Cushion Details">
    <span className="config-cushion-details__compact-label">Cushion Details</span>
    <div className="config-cushion-choices" role="group" aria-label="Cushion Details">
      {['enabled', 'disabled'].map((value) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)}>{value === 'enabled' ? 'Enabled' : 'Disabled'}</button>)}
    </div>
  </section>
  return <section className="config-cushion-details" aria-labelledby="cushion-details-title">
    <div><p className="eyebrow">Structure option</p><h2 id="cushion-details-title">Cushion Details</h2><p>Show or hide the original accent cushion.</p></div>
    <div className="config-cushion-choices" role="group" aria-label="Cushion Details">
      {['enabled', 'disabled'].map((value) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)}>{value === 'enabled' ? 'Enabled' : 'Disabled'}</button>)}
    </div>
  </section>
}

const ILLUMINATION_OPTIONS = [
  { id: 'warm', label: 'Warm Light' },
  { id: 'daylight', label: 'Daylight On' },
  { id: 'off', label: 'Daylight Off' },
]

function LampIlluminationControl({ selected = 'warm', onSelect, compact = false }) {
  const current = (selected === 'on' || !selected) ? 'warm' : selected
  if (compact) return <section className="config-cushion-details config-cushion-details--compact" aria-label="Lamp Illumination">
    <span className="config-cushion-details__compact-label">Illumination</span>
    <div className="config-cushion-choices config-three-choices" role="group" aria-label="Lamp Illumination">
      {ILLUMINATION_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          aria-pressed={current === opt.id}
          onClick={() => onSelect(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </section>
  return <section className="config-cushion-details" aria-labelledby="lamp-illumination-title">
    <div>
      <p className="eyebrow">Lighting atmosphere</p>
      <h2 id="lamp-illumination-title">Illumination</h2>
      <p>Switch between cozy 2700K Warm Light, neutral 5000K–5500K Daylight, and unlit studio ambiance.</p>
    </div>
    <div className="config-cushion-choices config-three-choices" role="group" aria-label="Lamp Illumination">
      {ILLUMINATION_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          aria-pressed={current === opt.id}
          onClick={() => onSelect(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </section>
}

function SorenCushionControl({
  cushionState = 'off',
  onCushionStateChange,
  cushionColor = '#8C4F2B',
  onCushionColorChange,
  compact = false
}) {
  const isCushionOn = cushionState === 'on'
  const fabricOptions = MATERIAL_OPTIONS.cushionFabric ?? []
  const selectedOption = fabricOptions.find(o => o.color === cushionColor) ?? fabricOptions[0]

  return <section className="config-material-group config-soren-cushion-group">
    <div className="config-section-title">
      <h2>Removable Seat Cushion</h2>
      <span>{isCushionOn ? selectedOption?.label : 'None (Woven Cord Only)'}</span>
    </div>
    <div className="config-cushion-choices" role="group" aria-label="Seat Cushion" style={{ marginBottom: isCushionOn ? '0.85rem' : '0' }}>
      <button
        type="button"
        aria-pressed={!isCushionOn}
        onClick={() => onCushionStateChange('off')}
      >
        Cushion Off
      </button>
      <button
        type="button"
        aria-pressed={isCushionOn}
        onClick={() => onCushionStateChange('on')}
      >
        Cushion On
      </button>
    </div>
    {isCushionOn && (
      <div>
        <p className="eyebrow" style={{ marginTop: '0.65rem', marginBottom: '0.4rem', fontSize: '0.65rem' }}>Cushion Upholstery</p>
        <div className="config-swatches">
          {fabricOptions.map((opt) => (
            <Swatch
              key={opt.id}
              option={opt}
              selected={cushionColor === opt.color}
              onClick={() => onCushionColorChange(opt.color)}
            />
          ))}
        </div>
      </div>
    )}
    <p className="config-capability">Tailored seat cushion fitted over the woven cord.</p>
  </section>
}

function AlmaPillowsControl({ selected = '4', onSelect, compact = false }) {
  const isTwo = selected === '2' || selected === 2
  if (compact) return <section className="config-cushion-details config-cushion-details--compact" aria-label="Pillow Arrangement">
    <span className="config-cushion-details__compact-label">Pillows</span>
    <div className="config-cushion-choices" role="group" aria-label="Pillow Arrangement">
      <button type="button" aria-pressed={isTwo} onClick={() => onSelect('2')}>2 Minimal</button>
      <button type="button" aria-pressed={!isTwo} onClick={() => onSelect('4')}>4 Full</button>
    </div>
  </section>
  return <section className="config-cushion-details" aria-labelledby="alma-pillows-title">
    <div>
      <p className="eyebrow">Styling option</p>
      <h2 id="alma-pillows-title">Pillow Arrangement</h2>
      <p>Choose between minimal 2 propped sleeping pillows or a full 4-pillow bedroom styling.</p>
    </div>
    <div className="config-cushion-choices" role="group" aria-label="Pillow Arrangement">
      <button type="button" aria-pressed={isTwo} onClick={() => onSelect('2')}>2 Pillows (Minimal)</button>
      <button type="button" aria-pressed={!isTwo} onClick={() => onSelect('4')}>4 Pillows (Full Styling)</button>
    </div>
  </section>
}

const UNDERGLOW_OPTIONS = [
  { id: 'warm', label: 'Warm 2700K Glow' },
  { id: 'neutral', label: 'Neutral 4000K' },
  { id: 'off', label: 'Lighting Off' },
]

function AlmaUnderglowControl({ selected = 'warm', onSelect, compact = false }) {
  const current = selected ?? 'warm'
  if (compact) return <section className="config-cushion-details config-cushion-details--compact" aria-label="Perimeter Lighting">
    <span className="config-cushion-details__compact-label">Shadow Glow</span>
    <div className="config-cushion-choices config-three-choices" role="group" aria-label="Perimeter Lighting">
      {UNDERGLOW_OPTIONS.map((opt) => (
        <button key={opt.id} type="button" aria-pressed={current === opt.id} onClick={() => onSelect(opt.id)}>
          {opt.label}
        </button>
      ))}
    </div>
  </section>
  return <section className="config-cushion-details" aria-labelledby="alma-underglow-title">
    <div>
      <p className="eyebrow">Atmospheric accent</p>
      <h2 id="alma-underglow-title">Perimeter Shadow-Gap Lighting</h2>
      <p>Subtle floor-skimming ambient glow skimming the 7mm grounded architectural reveal.</p>
    </div>
    <div className="config-cushion-choices config-three-choices" role="group" aria-label="Perimeter Lighting">
      {UNDERGLOW_OPTIONS.map((opt) => (
        <button key={opt.id} type="button" aria-pressed={current === opt.id} onClick={() => onSelect(opt.id)}>
          {opt.label}
        </button>
      ))}
    </div>
  </section>
}

function NordHardwareStyleControl({
  selectedStyle = 'pull',
  onSelectStyle,
  compact = false
}) {
  const isPull = selectedStyle !== 'none'
  if (compact) return <section className="config-cushion-details config-cushion-details--compact" aria-label="Hardware Style">
    <span className="config-cushion-details__compact-label">Hardware</span>
    <div className="config-cushion-choices" role="group" aria-label="Hardware Style">
      <button type="button" aria-pressed={isPull} onClick={() => onSelectStyle('pull')}>Finger Pulls</button>
      <button type="button" aria-pressed={!isPull} onClick={() => onSelectStyle('none')}>Handleless</button>
    </div>
  </section>
  return <section className="config-cushion-details" aria-labelledby="nord-hardware-title">
    <div>
      <p className="eyebrow">Hardware style</p>
      <h2 id="nord-hardware-title">Handle Configuration</h2>
      <p>Choose between top edge-mounted metal finger pulls or a clean flush push-to-open facade.</p>
    </div>
    <div className="config-cushion-choices" role="group" aria-label="Hardware Style">
      <button type="button" aria-pressed={isPull} onClick={() => onSelectStyle('pull')}>Edge Finger Pulls</button>
      <button type="button" aria-pressed={!isPull} onClick={() => onSelectStyle('none')}>Handleless (Push-to-Open)</button>
    </div>
  </section>
}

export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const requestedSlug = params.get('product')
  const product = CONFIGURATOR_PRODUCTS.find((item) => item.slug === requestedSlug) ?? CONFIGURATOR_PRODUCTS[0]
  const [tab, setTab] = useState('Materials')
  const [selectionState, setSelectionState] = useState(() => {
    const init = createInitialConfiguratorSelections(product)
    if (product.slug === 'terra-coffee-table' && params.get('geometry') === 'refined') {
      init.geometryVariant = 'refined'
    }
    return { slug: product.slug, values: init }
  })
  const selections = selectionsForProduct(selectionState, product)
  const [cameraCommand, setCameraCommand] = useState(null)
  const [notice, setNotice] = useState('')
  const addToCart = useShopStore((state) => state.addToCart)
  const modelComponents = useMemo(() => product.components, [product])

  useEffect(() => {
    if (requestedSlug !== product.slug) setParams({ product: product.slug }, { replace: true })
    const init = createInitialConfiguratorSelections(product)
    if (product.slug === 'terra-coffee-table' && params.get('geometry') === 'refined') {
      init.geometryVariant = 'refined'
    }
    setSelectionState({ slug: product.slug, values: init })
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
  if (product.slug === 'linnea-sofa') configText.push(`Cushion Details: ${selections.cushionDetails === 'disabled' ? 'Disabled' : 'Enabled'}`)
  if (product.slug === 'terra-coffee-table') configText.push(`Geometry: ${selections.geometryVariant === 'refined' ? 'Refined Handcrafted (Preview)' : 'Original Active Model'}`)
  if (product.slug === 'sol-table-lamp') {
    const cur = (selections.illumination === 'on' || !selections.illumination) ? 'warm' : selections.illumination
    const label = cur === 'warm' ? 'Warm Light' : cur === 'daylight' ? 'Daylight On' : 'Daylight Off'
    configText.push(`Illumination: ${label}`)
  }
  if (product.slug === 'soren-dining-chair') {
    const cushionOption = selections.cushion === 'on'
      ? `Cushion On (${(MATERIAL_OPTIONS.cushionFabric ?? []).find(o => o.color === selections.cushionColor)?.label ?? 'Cognac'})`
      : 'Cushion Off'
    configText.push(`Seat Cushion: ${cushionOption}`)
  }
  if (product.slug === 'alma-bed') {
    const isTwo = selections.pillows === '2' || selections.pillows === 2
    configText.push(`Pillows: ${isTwo ? '2 Pillows (Minimal)' : '4 Pillows (Full Styling)'}`)
    const glowMode = selections.underglow ?? 'warm'
    configText.push(`Shadow Lighting: ${glowMode === 'warm' ? 'Warm 2700K Glow' : glowMode === 'neutral' ? 'Neutral 4000K' : 'Lighting Off'}`)
  }
  if (product.slug === 'nord-sideboard') {
    const isPull = selections.handleStyle !== 'none'
    const hwLabel = (MATERIAL_OPTIONS.nordHardware ?? []).find(o => o.color === selections.hardware)?.label ?? 'Brushed Champagne Brass'
    configText.push(`Hardware: ${isPull ? `Finger Pulls (${hwLabel})` : 'Handleless (Push-to-Open)'}`)
  }

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
    const fabricOptions = product.slug === 'alma-bed' ? (MATERIAL_OPTIONS.bedFabric ?? MATERIAL_OPTIONS.fabric) : MATERIAL_OPTIONS.fabric
    const selectedFabric = fabricOptions.find((option) => option.color === (selections.headboard ?? selections.upholstery))?.id ?? 'ivory-boucle'
    const savedConfiguration = Object.fromEntries(product.components.flatMap((component) => {
      const color = selections[component.id]
      const option = MATERIAL_OPTIONS[component.kind]?.find((item) => item.color === color)
      return color && option ? [[component.label, { label: option.label, color }]] : []
    }))
    if (product.slug === 'linnea-sofa') savedConfiguration.cushionDetails = selections.cushionDetails === 'disabled' ? 'disabled' : 'enabled'
    if (product.slug === 'sol-table-lamp') {
      const cur = (selections.illumination === 'on' || !selections.illumination) ? 'warm' : selections.illumination
      savedConfiguration.illumination = cur === 'warm' ? 'Warm Light' : cur === 'daylight' ? 'Daylight On' : 'Daylight Off'
    }
    if (product.slug === 'soren-dining-chair') {
      savedConfiguration.cushion = selections.cushion === 'on'
        ? `Cushion On (${(MATERIAL_OPTIONS.cushionFabric ?? []).find(o => o.color === selections.cushionColor)?.label ?? 'Cognac'})`
        : 'Cushion Off'
    }
    if (product.slug === 'alma-bed') {
      const isTwo = selections.pillows === '2' || selections.pillows === 2
      savedConfiguration.pillows = isTwo ? '2 Pillows (Minimal)' : '4 Pillows (Full Styling)'
      const glowMode = selections.underglow ?? 'warm'
      savedConfiguration.underglow = glowMode === 'warm' ? 'Warm 2700K Glow' : glowMode === 'neutral' ? 'Neutral 4000K' : 'Lighting Off'
    }
    if (product.slug === 'nord-sideboard') {
      const isPull = selections.handleStyle !== 'none'
      const hwLabel = (MATERIAL_OPTIONS.nordHardware ?? []).find(o => o.color === selections.hardware)?.label ?? 'Brushed Champagne Brass'
      savedConfiguration.hardware = isPull ? `Finger Pulls (${hwLabel})` : 'Handleless (Push-to-Open)'
    }
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
            {product.slug === 'sol-table-lamp' && <>
              <span aria-hidden="true" />
              <button
                type="button"
                onClick={() => updateSelections((current) => {
                  const cur = (current.illumination === 'on' || !current.illumination) ? 'warm' : current.illumination
                  const next = cur === 'warm' ? 'daylight' : cur === 'daylight' ? 'off' : 'warm'
                  return { ...current, illumination: next }
                })}
                aria-label="Cycle lamp illumination"
              >
                {(() => {
                  const cur = (selections.illumination === 'on' || !selections.illumination) ? 'warm' : selections.illumination
                  if (cur === 'warm') return 'Warm Light'
                  if (cur === 'daylight') return 'Daylight On'
                  return 'Daylight Off'
                })()}
              </button>
            </>}
            {product.slug === 'alma-bed' && <>
              <span aria-hidden="true" />
              <button
                type="button"
                onClick={() => updateSelections((current) => ({
                  ...current,
                  pillows: (current.pillows === '2' || current.pillows === 2) ? '4' : '2'
                }))}
                aria-label="Toggle pillows"
              >
                {(selections.pillows === '2' || selections.pillows === 2) ? '2 Pillows' : '4 Pillows'}
              </button>
            </>}
            {product.slug === 'nord-sideboard' && <>
              <span aria-hidden="true" />
              <button
                type="button"
                onClick={() => updateSelections((current) => ({
                  ...current,
                  handleStyle: current.handleStyle === 'none' ? 'pull' : 'none'
                }))}
                aria-label="Toggle handles"
              >
                {selections.handleStyle === 'none' ? 'Handleless' : 'Pull Handles'}
              </button>
            </>}
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
            {product.components.map((component) => {
              const isHardware = component.id === 'hardware'
              const isHandleless = isHardware && selections.handleStyle === 'none'
              return <section className="config-material-group" key={component.id}>
                <div className="config-section-title">
                  <h2>{component.label}</h2>
                  <span>{isHandleless ? 'Handleless (Push-to-Open)' : (optionFor(component, selections[component.id])?.label ?? 'Original material')}</span>
                </div>
                {product.slug === 'nord-sideboard' && isHardware && (
                  <NordHardwareStyleControl
                    compact
                    selectedStyle={selections.handleStyle}
                    onSelectStyle={(value) => updateSelections((current) => ({ ...current, handleStyle: value }))}
                  />
                )}
                {!isHandleless && (
                  <div className="config-swatches">
                    {(MATERIAL_OPTIONS[component.kind] ?? []).map((option) => (
                      <Swatch
                        key={option.id}
                        option={option}
                        selected={selections[component.id] === option.color}
                        onClick={() => updateSelections((current) => ({ ...current, [component.id]: option.color }))}
                      />
                    ))}
                  </div>
                )}
                <p className="config-capability">
                  {isHandleless
                    ? 'Flush handleless aesthetic with concealed magnetic push-latches.'
                    : <>Changes the model’s <strong>{component.materials.join(', ')}</strong> material group.</>}
                </p>
                {product.slug === 'linnea-sofa' && component.id === 'accent' && <CushionDetailsControl compact selected={selections.cushionDetails} onSelect={(value) => updateSelections((current) => ({ ...current, cushionDetails: value }))} />}
                {product.slug === 'sol-table-lamp' && component.id === 'shade' && <LampIlluminationControl compact selected={selections.illumination} onSelect={(value) => updateSelections((current) => ({ ...current, illumination: value }))} />}
                {product.slug === 'alma-bed' && component.id === 'bedding' && <>
                  <AlmaPillowsControl compact selected={selections.pillows} onSelect={(value) => updateSelections((current) => ({ ...current, pillows: value }))} />
                  <AlmaUnderglowControl compact selected={selections.underglow} onSelect={(value) => updateSelections((current) => ({ ...current, underglow: value }))} />
                </>}
              </section>
            })}
            {product.slug === 'soren-dining-chair' && (
              <SorenCushionControl
                cushionState={selections.cushion}
                onCushionStateChange={(value) => updateSelections((current) => ({ ...current, cushion: value }))}
                cushionColor={selections.cushionColor}
                onCushionColorChange={(value) => updateSelections((current) => ({ ...current, cushionColor: value }))}
              />
            )}
            {product.model && product.components.length === 0 && <div className="config-notice"><p className="eyebrow">Integrated Studio Piece</p><p>{product.modelNote || 'No independently customizable material slots were found for this model.'}</p></div>}
          </div>}

          {tab === 'Structure' && <div className="config-info-list">
            <p className="eyebrow">Model components</p>
            {product.model ? <>
              <p className="text-sm leading-relaxed text-ink/65">The viewer exposes only the named mesh groups found in this model. Geometry-changing options are not available in the supplied asset.</p>
              {product.slug === 'linnea-sofa' && <CushionDetailsControl selected={selections.cushionDetails} onSelect={(value) => updateSelections((current) => ({ ...current, cushionDetails: value }))} />}
              {product.slug === 'sol-table-lamp' && <LampIlluminationControl selected={selections.illumination} onSelect={(value) => updateSelections((current) => ({ ...current, illumination: value }))} />}
              {product.slug === 'soren-dining-chair' && (
                <SorenCushionControl
                  cushionState={selections.cushion}
                  onCushionStateChange={(value) => updateSelections((current) => ({ ...current, cushion: value }))}
                  cushionColor={selections.cushionColor}
                  onCushionColorChange={(value) => updateSelections((current) => ({ ...current, cushionColor: value }))}
                />
              )}
              {product.slug === 'alma-bed' && <>
                <AlmaPillowsControl selected={selections.pillows} onSelect={(value) => updateSelections((current) => ({ ...current, pillows: value }))} />
                <AlmaUnderglowControl selected={selections.underglow} onSelect={(value) => updateSelections((current) => ({ ...current, underglow: value }))} />
              </>}
              {product.slug === 'nord-sideboard' && (
                <NordHardwareStyleControl
                  selectedStyle={selections.handleStyle}
                  onSelectStyle={(value) => updateSelections((current) => ({ ...current, handleStyle: value }))}
                />
              )}
              {product.slug === 'terra-coffee-table' && <section className="config-cushion-details" aria-labelledby="terra-geometry-title">
                <div><p className="eyebrow">Craftsmanship option</p><h2 id="terra-geometry-title">Tabletop & Plinth Geometry</h2><p>Compare the original active model with the refined handcrafted solid-oak geometry.</p></div>
                <div className="config-cushion-choices" role="group" aria-label="Tabletop & Plinth Geometry">
                  <button type="button" aria-pressed={selections.geometryVariant !== 'refined'} onClick={() => updateSelections((current) => ({ ...current, geometryVariant: 'original' }))}>Original (Active Asset)</button>
                  <button type="button" aria-pressed={selections.geometryVariant === 'refined'} onClick={() => updateSelections((current) => ({ ...current, geometryVariant: 'refined' }))}>Refined (Preview)</button>
                </div>
              </section>}
              <ul>{product.meshes.map((mesh) => <li key={mesh}><span>{mesh === 'Pillow' ? 'Cushion' : mesh}</span><span>Present</span></li>)}</ul>
              <p className="config-capability">{product.slug === 'terra-coffee-table' ? 'Refined geometry adds dual eased bullnose perimeter fillets and a deeply recessed pedestal base.' : 'Separate cushion or structural variants require additional model geometry.'}</p>
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
