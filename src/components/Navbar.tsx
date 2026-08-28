import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive ? 'text-gold-600' : 'text-royal-700 hover:text-gold-600'
    }`;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/cart', label: 'Cart' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-royal-100 bg-royal-50/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Sparkles className="h-7 w-7 text-gold-500" strokeWidth={1.5} />
          <span className="font-serif text-xl font-semibold tracking-wide text-royal-900">
            Omega <span className="text-gold-600">Beauty</span> World
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/login" className={navLinkClass}>
            Sign In
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-full bg-royal-900 px-4 py-2.5 text-sm font-medium text-royal-50 transition-colors hover:bg-royal-800"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-royal-950">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 text-royal-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-royal-100 bg-royal-50 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={navLinkClass}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
              Sign In
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
