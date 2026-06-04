export function Panel({ title, children, wide = false }) {
  return (
    <section className={wide ? 'panel wide' : 'panel'}>
      {typeof title === 'string' ? <h2>{title}</h2> : title}
      {children}
    </section>
  )
}

export function Field({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} {...props} />
    </label>
  )
}

export function SelectField({ label, value, onChange, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} {...props}>
        {children}
      </select>
    </label>
  )
}
