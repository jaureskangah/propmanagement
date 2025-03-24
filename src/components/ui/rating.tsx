
import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  readonly?: boolean;
}

export function Rating({ value, onChange, max = 5, className, readonly = false }: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;
        const filled = index <= (hoverValue || value);
        
        return (
          <Star 
            key={i}
            className={`h-5 w-5 ${readonly ? '' : 'cursor-pointer'} transition-colors ${
              filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => !readonly && setHoverValue(index)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange(index)}
          />
        );
      })}
    </div>
  );
}
