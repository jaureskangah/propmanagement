import { Building2, List, DollarSign, Gift, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onShowAuthModal: () => void;
}

export default function Header({ onShowAuthModal }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query to check if user is a tenant
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleDashboardClick = () => {
    if (profile?.is_tenant_user) {
      navigate("/tenant/maintenance");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("Current session status:", session ? "Active" : "No session", sessionError || '');
      
      if (!session || sessionError) {
        console.log("No active session found, proceeding with navigation");
        navigate("/");
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        if (error.message.includes("session_not_found")) {
          console.log("Session not found during logout, proceeding with navigation");
          navigate("/");
          return;
        }
        toast.error("Error signing out. Please try again.");
        return;
      }

      console.log("Sign out successful");
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-[#ea384c]" />
            <span className="text-xl font-bold text-black">PropManagement</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors">
              <List className="h-4 w-4" />
              <span>Features</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors">
              <Gift className="h-4 w-4" />
              <span>Free Trial</span>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-[#ea384c]"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
                onClick={onShowAuthModal}
              >
                <LogIn className="h-4 w-4 mr-2" />
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