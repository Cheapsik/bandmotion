import { Outlet, useLocation } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

export function MobileLayout() {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="app-shell">
      <div className="app-bg" />

      <main
        className={
          isDashboard
            ? 'page-content dashboard-page flex flex-col flex-1 min-h-0 overflow-hidden'
            : 'page-content page-top page-bottom-with-tab flex-1 overflow-y-auto overflow-x-hidden no-scrollbar'
        }
      >
        <Outlet />
      </main>

      <BottomTabBar />
    </div>
  );
}
