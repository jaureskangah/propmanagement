
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenancePhotoGallery } from "../../MaintenancePhotoGallery";

interface PhotoGallerySectionProps {
  photos?: string[];
}

export const PhotoGallerySection = ({ photos }: PhotoGallerySectionProps) => {
  const { t } = useLocale();

  if (!photos || photos.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('maintenancePhotos')}</h3>
      <MaintenancePhotoGallery photos={photos} />
    </div>
  );
};
