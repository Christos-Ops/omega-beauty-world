import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-royal-100 bg-royal-950 text-royal-100">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-gold-400" strokeWidth={1.5} />
              <span className="font-serif text-xl font-semibold tracking-wide text-royal-50">
                Omega <span className="text-gold-400">Beauty</span> World
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-royal-200">
              Curated luxury beauty — skincare, makeup, fragrance, and haircare from the
              world’s finest ateliers. Delivered with care.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Explore
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-royal-200">
              <li><Link to="/catalog" className="hover:text-gold-300">All Products</Link></li>
              <li><Link to="/catalog?category=Skincare" className="hover:text-gold-300">Skincare</Link></li>
              <li><Link to="/catalog?category=Makeup" className="hover:text-gold-300">Makeup</Link></li>
              <li><Link to="/catalog?category=Fragrance" className="hover:text-gold-300">Fragrance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-royal-200">
              <li><Link to="/login" className="hover:text-gold-300">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-gold-300">Create Account</Link></li>
              <li><span className="cursor-default">Shipping & Returns</span></li>
              <li><span className="cursor-default">Contact Us</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-royal-800 pt-6 sm:flex-row">
          <p className="text-xs text-royal-300">
            © {new Date().getFullYear()} Omega Beauty World. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="text-royal-200 hover:text-gold-300">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-royal-200 hover:text-gold-300">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-royal-200 hover:text-gold-300">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
