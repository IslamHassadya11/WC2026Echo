const SIZES = {
  xs:  { w: 20,  cls: 'w-5  h-[14px]' },
  sm:  { w: 32,  cls: 'w-8  h-[22px]' },
  md:  { w: 48,  cls: 'w-12 h-[32px]' },
  lg:  { w: 80,  cls: 'w-20 h-[52px]' },
  xl:  { w: 120, cls: 'w-28 h-[76px]' },
  '2xl':{ w:160, cls: 'w-40 h-[104px]'},
}

export default function Flag({ code, name, size = 'sm', className = '' }) {
  if (!code) return <div className={`${SIZES[size].cls} bg-wc-border rounded flex-shrink-0 ${className}`} />
  const s = SIZES[size] || SIZES.sm
  return (
    <img
      src={`https://flagcdn.com/w${s.w}/${code}.png`}
      srcSet={`https://flagcdn.com/w${s.w * 2}/${code}.png 2x`}
      alt={name || code}
      width={s.w}
      className={`flag-img ${s.cls} ${className}`}
      loading="lazy"
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}
