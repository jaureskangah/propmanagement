
import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  className?: string;
}

export function Rating({ value, onChange, max = 5, className }: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const index = i + 1;
        const filled = index <= (hoverValue || value);
        
        return (
          <Star 
            key={i}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverValue(index)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(index)}
          />
        );
      })}
    </div>
  );
}
