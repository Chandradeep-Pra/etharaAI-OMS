export function Alerts({ error, notice }) {
  return (
    <section className="status-row" aria-live="polite">
      {error ? <div className="alert error">{error}</div> : null}
      {notice ? <div className="alert success">{notice}</div> : null}
    </section>
  )
}
