
import React from "react";
import { VendorReview } from "@/types/vendor";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorRatingDetailsProps {
  reviews: VendorReview[];
}

export const VendorRatingDetails = ({ reviews }: VendorRatingDetailsProps) => {
  const { t } = useLocale();
  
  if (!reviews.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {t('noReviewsYet')}
      </div>
    );
  }

  // Calculer les moyennes des différentes catégories
  const qualityAvg = reviews.reduce((sum, review) => sum + review.quality_rating, 0) / reviews.length;
  const priceAvg = reviews.reduce((sum, review) => sum + review.price_rating, 0) / reviews.length;
  const punctualityAvg = reviews.reduce((sum, review) => sum + review.punctuality_rating, 0) / reviews.length;
  
  // Calculer les statistiques par étoile (5 étoiles, 4 étoiles, etc.)
  const ratingCounts = Array(5).fill(0);
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1]++;
    }
  });
  
  const totalReviews = reviews.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Distribution des étoiles */}
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium">{t('ratingDistribution')}</h4>
          {ratingCounts.map((count, index) => {
            const starNumber = 5 - index;
            const percentage = (count / totalReviews) * 100;
            
            return (
              <div key={starNumber} className="flex items-center gap-2">
                <div className="flex items-center w-16">
                  <span className="text-xs">{starNumber}</span>
                  <Star className="h-3.5 w-3.5 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-xs w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
        
        {/* Moyennes par catégorie */}
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-medium">{t('categoryRatings')}</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{t('quality')}</span>
                <span className="font-medium">{qualityAvg.toFixed(1)}/5</span>
              </div>
              <Progress value={(qualityAvg / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{t('price')}</span>
                <span className="font-medium">{priceAvg.toFixed(1)}/5</span>
              </div>
              <Progress value={(priceAvg / 5) * 100} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{t('punctuality')}</span>
                <span className="font-medium">{punctualityAvg.toFixed(1)}/5</span>
              </div>
              <Progress value={(punctualityAvg / 5) * 100} className="h-2" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center pt-2">
        {t('basedOn')} {totalReviews} {totalReviews === 1 ? t('reviewSingular') : t('reviewsPlural')}
      </div>
    </div>
  );
};
