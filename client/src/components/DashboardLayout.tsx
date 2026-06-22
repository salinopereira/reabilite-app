import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  CheckCircle,
  User,
  Trophy,
  LogOut,
  ArrowLeft,
  Shield,
  PanelLeft,
  Dumbbell,
  Heart,
  Apple,
  Users,
  Target,
  Flame,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", color: "#22BFEC" },
  { icon: CheckCircle, label: "ReabiCheck", path: "/reabicheck", color: "#305ACF" },
  { icon: User, label: "Perfil", path: "/profile", color: "#8966D2" },
  { icon: Trophy, label: "Gamificação", path: "/gamification", color: "#22BFEC" },
  { icon: Dumbbell, label: "Treinos", path: "/workouts", color: "#305ACF", soon: true },
  { icon: Apple, label: "Nutrição", path: "/nutrition", color: "#8966D2", soon: true },
  { icon: Heart, label: "Saúde Mental", path: "/mental-health", color: "#22BFEC", soon: true },
  { icon: Users, label: "Ranking", path: "/ranking", color: "#305ACF", soon: true },
  { icon: Target, label: "Desafios", path: "/challenges", color: "#8966D2", soon: true },
  { icon: Flame, label: "Feed Social", path: "/feed", color: "#22BFEC", soon: true },
];

const adminMenuItems = [
  { icon: Shield, label: "Administração", path: "/admin", color: "#8966D2" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#192E78] to-[#305ACF]">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white">REABILITE</h1>
          <p className="text-blue-200 text-center text-sm">Faça login para continuar</p>
          <Button onClick={() => (window.location.href = "/")} size="lg" className="w-full bg-[#22BFEC] hover:bg-[#305ACF] text-white">
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (w: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isAdmin = user?.role === "admin";

  const activeItem = [...menuItems, ...adminMenuItems].find(i => i.path === location);

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - left;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleNav = (path: string, soon?: boolean) => {
    if (soon) return;
    setLocation(path);
  };

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r border-[#192E78]/20 bg-white" disableTransition={isResizing}>
          {/* Header */}
          <SidebarHeader className="h-16 justify-center border-b border-[#192E78]/10">
            <div className="flex items-center gap-3 px-2">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-[#192E78]/10 rounded-lg transition-colors focus:outline-none"
              >
                <PanelLeft className="h-4 w-4 text-[#192E78]" />
              </button>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-[#22BFEC]" />
                  <span className="font-bold text-[#192E78] tracking-tight truncate">REABILITE</span>
                </div>
              )}
            </div>
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="gap-0 py-2">
            <SidebarMenu className="px-2 gap-0.5">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNav(item.path, item.soon)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal relative ${
                        isActive
                          ? "bg-[#192E78] text-white hover:bg-[#192E78]"
                          : item.soon
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#192E78]/10 text-slate-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" style={{ color: isActive ? "white" : item.color }} />
                      <span>{item.label}</span>
                      {item.soon && !isCollapsed && (
                        <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">em breve</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Admin section */}
              {isAdmin && (
                <>
                  {!isCollapsed && (
                    <div className="px-3 pt-3 pb-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Admin</p>
                    </div>
                  )}
                  {adminMenuItems.map(item => {
                    const isActive = location === item.path;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => setLocation(item.path)}
                          tooltip={item.label}
                          className={`h-10 transition-all font-normal ${
                            isActive ? "bg-[#8966D2] text-white hover:bg-[#8966D2]" : "hover:bg-[#8966D2]/10 text-slate-700"
                          }`}
                        >
                          <item.icon className="h-4 w-4 shrink-0" style={{ color: isActive ? "white" : item.color }} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
            </SidebarMenu>
          </SidebarContent>

          {/* Footer — user + logout */}
          <SidebarFooter className="p-3 border-t border-[#192E78]/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#192E78]/10 transition-colors w-full text-left focus:outline-none">
                  <Avatar className="h-8 w-8 border-2 border-[#22BFEC] shrink-0">
                    <AvatarFallback className="text-xs font-bold bg-[#192E78] text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#192E78] truncate leading-none">{user?.name || "-"}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">{user?.email || "-"}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => setLocation("/admin")} className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    Administração
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Resize handle */}
        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#22BFEC]/40 transition-colors"
            onMouseDown={() => setIsResizing(true)}
            style={{ zIndex: 50 }}
          />
        )}
      </div>

      <SidebarInset className="bg-slate-50">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-white px-3 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg" />
              <span className="font-semibold text-[#192E78]">{activeItem?.label ?? "REABILITE"}</span>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Desktop top bar with back button */}
        {!isMobile && (
          <div className="flex items-center gap-3 px-6 py-3 border-b bg-white sticky top-0 z-40">
            {location !== "/" && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#192E78] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{user?.name}</span>
              {isAdmin && (
                <span className="text-[10px] bg-[#8966D2] text-white px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
              )}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
