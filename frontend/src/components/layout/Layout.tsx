import { Outlet } from 'react-router-dom';
import Header from './Header';


export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
