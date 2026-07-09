import { NavLink } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, User } from 'lucide-react';

const tabs = [
  { to: '/dashboard', icon: Home, label: 'Główna' },
  { to: '/exercises', icon: BookOpen, label: 'Treningi' },
  { to: '/progress', icon: TrendingUp, label: 'Postępy' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export function BottomTabBar() {
  return (
    <nav
      className="fixed z-50 inset-x-4 max-w-lg mx-auto glass-strong rounded-full"
      style={{ bottom: 'var(--nav-bar-offset)' }}
    >
      <div className="flex items-center justify-around h-[60px] px-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] py-1.5 rounded-full transition-all duration-200 ${
                isActive ? 'text-theme' : 'text-theme-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    isActive ? 'bg-white/12' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 1.8 : 1.2} />
                </span>
                <span className="text-[9px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
