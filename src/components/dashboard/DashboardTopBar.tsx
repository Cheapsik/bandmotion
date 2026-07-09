import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function formatTodayLabel() {
  const raw = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function DashboardTopBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-white truncate">{formatTodayLabel()}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/profile')}
        aria-label="Profil"
        className="btn-icon"
      >
        <User size={18} strokeWidth={1.2} className="text-white/85" />
      </button>
    </div>
  );
}
