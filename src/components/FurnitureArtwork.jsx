const OAK = '#A77B4F'
const INK = '#594438'

function SofaShape({ fabric }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="320" cy="368" rx="198" ry="18" fill="#4C4032" opacity="0.11" />
      <path d="M152 290 L173 290 L183 356 L160 356 Z M455 290 L476 290 L482 356 L460 356 Z" fill="#76563A" />
      <path d="M143 178 Q143 152 168 150 L465 150 Q486 152 489 178 L489 302 L143 302 Z" fill={fabric} />
      <path d="M451 166 Q478 163 490 184 L507 279 Q510 299 490 302 L463 294 Z" fill="#BCA785" />
      <path d="M149 233 Q122 232 119 256 L116 292 Q117 309 136 310 L178 306 L178 235 Z" fill={fabric} />
      <path d="M454 235 L493 233 Q518 234 520 257 L524 291 Q522 308 504 310 L460 306 Z" fill="#D9C7AA" />
      <path d="M177 279 Q184 269 199 269 H438 Q454 270 460 282 L466 309 Q463 324 448 326 H186 Q171 323 170 309 Z" fill="#CBB99C" />
      <path d="M184 177 Q184 165 198 165 H309 Q323 166 323 179 V246 Q322 259 309 260 H198 Q184 259 184 246 Z" fill="#E9D9BF" />
      <path d="M330 179 Q330 166 344 165 H443 Q457 166 457 179 V246 Q456 259 443 260 H344 Q330 259 330 246 Z" fill="#E3D2B5" />
      <path d="M184 259 Q184 248 198 247 H313 Q328 248 328 261 V287 Q326 300 312 301 H198 Q184 300 184 286 Z" fill="#D9C7AA" />
      <path d="M331 261 Q331 248 346 247 H443 Q458 248 458 261 V286 Q456 300 442 301 H346 Q331 300 331 286 Z" fill="#D2BE9F" />
      <path d="M156 178 Q156 161 174 160 H462" fill="none" stroke="#F4E9D8" strokeWidth="3" opacity="0.8" />
      <path d="M194 176 V245 Q194 252 201 252 H307 M340 176 V245 Q340 252 347 252 H438" fill="none" stroke="#B49E7D" strokeWidth="1.6" opacity="0.65" />
      <path d="M184 267 Q250 260 321 267 M331 267 Q395 260 458 267" fill="none" stroke="#AE9775" strokeWidth="1.5" opacity="0.65" />
      <path d="M153 291 L174 294 M468 293 L489 290" stroke={OAK} strokeWidth="4" />
      <path d="M167 300 L173 345 M475 300 L479 345" stroke={OAK} strokeWidth="7" />
    </g>
  )
}

function ChairShape({ fabric, lounge = false }) {
  if (lounge) return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="320" cy="369" rx="120" ry="16" fill="#4C4032" opacity="0.12" />
      <path d="M235 282 L252 282 L264 356 L244 356 M382 281 L399 281 L409 356 L389 356" fill="none" stroke={OAK} strokeWidth="13" />
      <path d="M230 156 Q230 135 251 136 H378 Q398 139 399 160 L412 287 Q410 309 389 311 H240 Q220 308 220 289 Z" fill={fabric} />
      <path d="M246 157 Q248 148 258 148 H371 Q382 150 383 162 L391 236 Q390 250 378 251 H257 Q245 248 245 236 Z" fill="#E9D9BF" />
      <path d="M220 252 Q236 238 258 245 L378 244 Q402 240 414 259 L428 289 Q430 307 411 312 H226 Q207 306 211 287 Z" fill="#D2BE9F" />
      <path d="M230 253 Q320 265 409 252 M250 162 V231 Q250 240 262 240 H370" fill="none" stroke="#AE9775" strokeWidth="2" opacity="0.65" />
      <path d="M245 312 L242 351 M397 312 L404 351 M245 351 L402 351" fill="none" stroke={OAK} strokeWidth="10" />
    </g>
  )
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="320" cy="370" rx="126" ry="14" fill="#4C4032" opacity="0.11" />
      <path d="M229 267 L245 267 L255 359 M391 267 L406 267 L395 359 M245 272 L394 272" fill="none" stroke={OAK} strokeWidth="10" />
      <path d="M238 160 Q238 146 251 146 H386 Q399 148 399 162 L397 246 Q395 261 381 262 H254 Q239 260 239 246 Z" fill={fabric} />
      <path d="M253 164 Q253 157 261 157 H376 Q384 158 384 166 V234 Q383 242 375 242 H262 Q253 241 253 233 Z" fill="#E9D9BF" />
      <path d="M222 250 Q224 237 239 235 L397 235 Q413 238 418 253 L410 275 Q406 286 391 286 H245 Q231 284 227 274 Z" fill="#D2BE9F" />
      <path d="M245 249 H393 M261 164 V231" fill="none" stroke="#AE9775" strokeWidth="2" opacity="0.65" />
    </g>
  )
}

function ObjectShape({ type, fabric }) {
  if (type === 'sofa') return <SofaShape fabric={fabric} />
  if (type === 'chair') return <ChairShape fabric={fabric} />
  if (type === 'lounge') return <ChairShape fabric={fabric} lounge />
  if (type === 'table') return (
    <g strokeLinejoin="round">
      <ellipse cx="320" cy="357" rx="155" ry="17" fill="#4C4032" opacity="0.12" />
      <path d="M180 220 L217 230 L205 346 L181 346 Z M409 230 L448 220 L459 346 L435 346 Z" fill="#8D6845" />
      <path d="M148 211 Q320 174 492 211 L479 247 Q320 277 161 247 Z" fill={fabric} />
      <path d="M161 247 Q320 276 479 247 V264 Q320 295 161 264 Z" fill="#8A6644" />
      <path d="M177 216 Q320 191 466 216" fill="none" stroke="#E7D1B1" strokeWidth="4" opacity="0.7" />
    </g>
  )
  if (type === 'bed') return (
    <g strokeLinejoin="round">
      <ellipse cx="320" cy="365" rx="190" ry="14" fill="#4C4032" opacity="0.1" />
      <path d="M147 170 Q147 150 168 150 H452 Q472 152 472 172 V288 H147 Z" fill={fabric} />
      <path d="M164 176 Q164 164 177 164 H443 Q456 165 456 178 V247 H164 Z" fill="#E9D9BF" />
      <path d="M128 258 Q320 244 510 258 L494 312 H145 Z" fill="#BFA987" />
      <path d="M145 312 H494 L483 335 H158 Z" fill="#957950" />
      <path d="M176 335 L184 356 M458 335 L450 356" stroke={OAK} strokeWidth="12" />
      <path d="M164 247 Q320 238 456 247" fill="none" stroke="#AE9775" strokeWidth="2" />
    </g>
  )
  if (type === 'storage') return (
    <g strokeLinejoin="round">
      <ellipse cx="320" cy="364" rx="180" ry="13" fill="#4C4032" opacity="0.1" />
      <path d="M148 196 Q148 187 160 187 H480 V325 H148 Z" fill={fabric} />
      <path d="M158 203 H468 V312 H158 Z" fill="#765A43" />
      <path d="M163 208 H311 V307 H163 Z M316 208 H463 V307 H316 Z" fill={fabric} />
      <path d="M311 205 V310 M316 205 V310" stroke="#806146" strokeWidth="3" />
      <circle cx="294" cy="258" r="4" fill="#73563B" /><circle cx="334" cy="258" r="4" fill="#73563B" />
      <path d="M174 325 L179 350 M452 325 L447 350" stroke="#765A43" strokeWidth="10" />
    </g>
  )
  if (type === 'lamp') return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="320" cy="365" rx="90" ry="12" fill="#4C4032" opacity="0.1" />
      <path d="M285 183 Q320 170 355 183 L385 257 Q320 279 255 257 Z" fill="#E9E1D2" />
      <path d="M313 258 H327 L337 340 H303 Z" fill="#9C8260" />
      <path d="M278 337 Q320 319 362 337 L373 358 Q320 375 267 358 Z" fill={fabric} />
      <path d="M278 337 Q320 349 362 337" fill="none" stroke="#9C8260" strokeWidth="2" />
    </g>
  )
  return (
    <g strokeLinejoin="round">
      <ellipse cx="320" cy="365" rx="100" ry="12" fill="#4C4032" opacity="0.1" />
      <path d="M250 327 Q244 290 265 253 L279 188 Q320 170 361 188 L375 253 Q396 290 390 327 Q320 352 250 327 Z" fill={fabric} />
      <path d="M279 189 Q320 176 361 189" fill="none" stroke="#F1E4CD" strokeWidth="4" />
    </g>
  )
}

export default function FurnitureArtwork({ type = 'sofa', fabric = '#D9C7AA', name = 'Furniture', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 640 420" role="img" aria-label={`${name} furniture illustration`}>
      <ObjectShape type={type} fabric={fabric} />
    </svg>
  )
}
