interface PillTab {
  id: string;
  label: string;
}

interface PillTabsProps {
  tabs: PillTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function PillTabs({ tabs, activeId, onChange }: PillTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-medium transition-all duration-200 border ${
              active ? 'pill-active' : 'pill-inactive'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
