import { FABRIC_FINISHES } from '../data/fabricFinishes'

export function FabricFinishSelector({ selected, onSelect }) {
  const active = FABRIC_FINISHES.find((finish) => finish.id === selected) ?? FABRIC_FINISHES[0]
  return (
    <div className="mt-8">
      <p className="eyebrow mb-3 text-ink/65">Finish · {active.name}</p>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Choose fabric finish">
        {FABRIC_FINISHES.map((finish) => <button
          key={finish.id}
          type="button"
          onClick={() => onSelect(finish.id)}
          aria-pressed={selected === finish.id}
          aria-label={`Select ${finish.name} fabric finish`}
          title={finish.name}
          className={`h-10 w-10 rounded-full border-2 ${selected === finish.id ? 'border-terracotta' : 'border-paper'}`}
          style={{ backgroundColor: finish.hex }}
        />)}
      </div>
    </div>
  )
}

export function FabricFinishImage({ product, finish, alt, className = '', imageClassName = '', width = '1122', height = '1402', loading = 'lazy' }) {
  if (!product?.fabricMask || !finish) {
    return <img src={product?.image} alt={alt} width={width} height={height} loading={loading} decoding="async" className={imageClassName} />
  }

  const mask = `url("${product.fabricMask}")`
  return (
    <span className={`fabric-finish-image ${className}`}>
      <img src={product.image} alt={alt} width={width} height={height} loading={loading} decoding="async" className={imageClassName} />
      <span
        aria-hidden="true"
        className="fabric-finish-image__overlay"
        style={{
          backgroundColor: finish.hex,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </span>
  )
}
