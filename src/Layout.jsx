import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  Store, 
  ClipboardCheck,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const navigationBase = [
  { name: 'Dashboard', page: 'Dashboard', icon: LayoutDashboard },
  { name: 'PDVs', page: 'PDVs', icon: Store },
  { name: 'Relatórios', page: 'Relatorios', icon: ClipboardCheck },
];

const adminNavItem = { name: 'Usuários', page: 'Users', icon: Users };

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = useMemo(() => {
    const items = [...navigationBase];
    if (role === 'admin') {
      items.push(adminNavItem);
    }
    return items;
  }, [role]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7800] to-[#e66a00] flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800">Qualidade PDV</span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header (when sidebar is closed) */}
      <header className={cn(
        "hidden lg:flex fixed top-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 items-center gap-4 transition-all duration-300",
        sidebarOpen ? "left-64" : "left-0"
      )}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-slate-100"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5 text-slate-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-slate-600" />
          )}
        </Button>
        {!sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7800] to-[#e66a00] flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">Qualidade PDV</span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {user?.email ? user.email : 'Usuário'}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-700"
            onClick={async () => {
              await signOut();
              navigate('/Login');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out",
        // Desktop
        "lg:z-40",
        sidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full",
        // Mobile
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !sidebarOpen && "lg:-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7800] to-[#e66a00] flex items-center justify-center shadow-lg shadow-orange-500/25">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">Qualidade PDV</h1>
                <p className="text-xs text-slate-500">Gestão de Qualidade</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = currentPageName === item.page;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-orange-50 text-[#ff7800]" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-[#ff7800]" : "text-slate-400"
                  )} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-[#ff7800]/60" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
              <p className="text-xs text-slate-500 text-center">
                Sistema de Gestão de Qualidade
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen transition-all duration-300",
        "pt-16 lg:pt-14",
        sidebarOpen ? "lg:pl-64" : "lg:pl-0"
      )}>
        {children}
      </main>
    </div>
  );
}