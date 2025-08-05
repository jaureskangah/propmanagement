import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Settings,
  Monitor,
  BookOpen,
  Rocket,
  TestTube
} from 'lucide-react';

export const AdminNavigation = () => {
  const location = useLocation();

  const adminPages = [
    { 
      to: "/production-dashboard", 
      label: "Production", 
      icon: Settings,
      description: "Vérification production" 
    },
    { 
      to: "/monitoring", 
      label: "Surveillance", 
      icon: Monitor,
      description: "Surveillance temps réel" 
    },
    { 
      to: "/documentation", 
      label: "Documentation", 
      icon: BookOpen,
      description: "Documentation complète" 
    },
    { 
      to: "/go-live", 
      label: "Déploiement", 
      icon: Rocket,
      description: "Préparation déploiement" 
    },
    { 
      to: "/test-restrictions", 
      label: "Tests", 
      icon: TestTube,
      description: "Tests de restrictions" 
    }
  ];

  return (
    <Card className="border-muted mb-6">
      <CardContent className="p-4">
        <nav className="flex flex-wrap gap-2">
          {adminPages.map((page) => {
            const Icon = page.icon;
            const isActive = location.pathname === page.to;
            return (
              <Link
                key={page.to}
                to={page.to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                  "hover:bg-accent/50 border",
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "border-border hover:border-accent-foreground/20"
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">{page.label}</div>
                  <div className="text-xs opacity-70">{page.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};