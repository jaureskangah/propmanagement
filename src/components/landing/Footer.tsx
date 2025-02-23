
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocale } from "../providers/LocaleProvider";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#ea384c]" />
              <span className="text-xl font-bold text-white">{t("companyName")}</span>
            </div>
            <p className="text-sm">
              {t("companyDescription")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("product")}</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-white transition-colors">{t("features")}</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">{t("pricing")}</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">{t("security")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">{t("aboutUs")}</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">{t("careers")}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t("privacyPolicy")}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t("termsOfService")}</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">{t("cookiePolicy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t("companyName")}. {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}
