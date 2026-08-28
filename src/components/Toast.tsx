import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  message: string;
  onDone?: () => void;
}

export default function Toast({ message, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
      <div className="flex items-center gap-3 rounded-2xl bg-royal-900 px-5 py-4 shadow-xl">
        <CheckCircle className="h-5 w-5 text-gold-400" />
        <span className="text-sm font-medium text-royal-50">{message}</span>
        <Link to="/cart" className="ml-2 text-sm font-semibold text-gold-400 hover:text-gold-300">
          View
        </Link>
      </div>
    </div>
  );
}
