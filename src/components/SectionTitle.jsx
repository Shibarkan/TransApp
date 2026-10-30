function SectionTitle({ title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {action}
    </div>
  )
}

export default SectionTitle
