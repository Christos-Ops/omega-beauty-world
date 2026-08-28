import { Star } from 'lucide-react';

interface Props {
  rating: number;
  reviews?: number;
}

export default function RatingStars({ rating, reviews }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= Math.round(rating)
                ? 'fill-gold-400 text-gold-400'
                : 'fill-royal-100 text-royal-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-royal-700">{rating}</span>
      {reviews !== undefined && (
        <span className="text-xs text-royal-400">({reviews} reviews)</span>
      )}
    </div>
  );
}
