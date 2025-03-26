
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenanceFeedbackTabProps {
  feedback: string;
  rating: number;
}

export const MaintenanceFeedbackTab = ({ feedback, rating }: MaintenanceFeedbackTabProps) => {
  const { t } = useLocale();
  
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-xl ${i < count ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (!feedback && !rating) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md">
        <p className="text-gray-500">No feedback provided yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rating > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Rating:</h4>
          <div className="flex">
            {renderStars(rating)}
            <span className="ml-2 text-gray-600">{rating}/5</span>
          </div>
        </div>
      )}
      
      {feedback && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500">Feedback:</h4>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-800">{feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
