import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-7xl font-bold text-gold-400">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-royal-900">Page Not Found</h1>
      <p className="mt-2 max-w-md text-royal-500">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="btn-gold mt-8">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
