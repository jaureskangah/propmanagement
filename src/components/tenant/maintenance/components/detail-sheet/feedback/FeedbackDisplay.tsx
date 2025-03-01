
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FeedbackDisplayProps {
  rating: number;
  feedback: string;
  onEdit: () => void;
}

export const FeedbackDisplay = ({
  rating,
  feedback,
  onEdit
}: FeedbackDisplayProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
      <div>
        <p className="text-sm text-gray-500 mb-1">{t('rating')}</p>
        <Rating 
          value={rating} 
          onChange={() => {}} 
          max={5}
          className="mb-3" 
        />
      </div>
      
      {feedback && (
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('comments')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-white dark:bg-gray-700 p-3 rounded-md">
            {feedback}
          </p>
        </div>
      )}
      
      <Button 
        onClick={onEdit} 
        variant="outline"
        className="mt-2"
      >
        {t('edit')}
      </Button>
    </div>
  );
};
