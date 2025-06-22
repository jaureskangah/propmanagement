
import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Keyboard shortcut support
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const ModernSidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-sidebar-background border-r border-sidebar-border flex-shrink-0 fixed left-0 top-0 z-30",
        className
      )}
      animate={{
        width: animate ? (open ? "270px" : "80px") : "270px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <>
      <div className="md:hidden fixed top-2 left-2 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-white/80 backdrop-blur-sm shadow-sm rounded-md p-2 hover:bg-white/90 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed left-0 top-0 h-full w-[85vw] max-w-[350px] bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col",
                className
              )}
              {...props}
            >
              <div className="absolute right-4 top-4 z-50">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  href,
  icon,
  children,
  className,
  isActive = false,
  onClick,
  ...props
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
} & React.ComponentProps<"a">) => {
  const { open, animate } = useSidebar();
  
  const linkContent = (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 group cursor-pointer",
        isActive 
          ? "bg-[#ea384c] text-white shadow-md" 
          : "hover:bg-muted hover:text-[#ea384c] dark:hover:bg-[#ea384c]/20",
        open ? "" : "justify-center px-2",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="font-medium whitespace-nowrap group-hover:translate-x-1 transition-transform duration-150"
      >
        {children}
      </motion.span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {linkContent}
      </a>
    );
  }

  return linkContent;
};
