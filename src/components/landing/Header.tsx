import { Building2, List, DollarSign, Gift, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

interface HeaderProps {
  onShowAuthModal: () => void;
}

export default function Header({ onShowAuthModal }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-red-600">PropManager</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors">
              <List className="h-4 w-4" />
              <span>Features</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 hover:text-red-600 transition-colors">
              <Gift className="h-4 w-4" />
              <span>Free Trial</span>
            </div>
            {user ? (
              <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={onShowAuthModal}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden">
            <List className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}