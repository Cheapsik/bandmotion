interface Tab {
  id: string;
  label: string;
}

interface DashboardHeroTabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function DashboardHeroTabs({ tabs, activeId, onChange }: DashboardHeroTabsProps) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`btn-pill ${active ? 'btn-pill--active' : ''}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
