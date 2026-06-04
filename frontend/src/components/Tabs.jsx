import { tabs } from '../lib/constants'

export function Tabs({ activeTab, onChange }) {
  return (
    <nav className="tabs" aria-label="Inventory sections">
      {tabs.map((tab) => (
        <button
          className={activeTab === tab.id ? 'tab active' : 'tab'}
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
