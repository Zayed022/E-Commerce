import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import './Header.css'; // create per Figma

export default function Header() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/products" className="header__logo">
          GroKart
        </Link>
      </div>
      <nav className="header__nav">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders/my">My Orders</Link>
      </nav>
      <div className="header__right">
        {auth.user ? (
          <>
            <span className="header__email">{auth.user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
