import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Shield, 
  KeyRound, 
  BookOpen, 
  GraduationCap, 
  Landmark, 
  ShoppingBag, 
  Wallet, 
  FileCheck, 
  Coins, 
  Package, 
  BarChart3, 
  CheckSquare, 
  History, 
  Sliders, 
  MapPin, 
  CreditCard, 
  UserCheck, 
  Home, 
  FileText, 
  Receipt, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { PortalType, DemoRole, UserProfile, RoleDefinition, MenuItem } from '../types';
import { resolveEffectiveMenus, DEFAULT_STAFF_ROLE_TEMPLATES } from '../permissions/permissionCatalogue';

interface SidebarProps {
  portalType: PortalType;
  currentRole: DemoRole;
  currentTab: string;
  onTabChange: (tabId: string) => void;
  activeStaffUser?: UserProfile;
  staffUsers?: UserProfile[];
  onSelectStaffUser?: (user: UserProfile) => void;
  roles?: RoleDefinition[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Building,
  Users,
  Shield,
  KeyRound,
  BookOpen,
  GraduationCap,
  Landmark,
  ShoppingBag,
  Wallet,
  FileCheck,
  Coins,
  Package,
  BarChart3: LayoutDashboard,
  CheckSquare,
  History,
  Sliders,
  MapPin,
  CreditCard,
  UserCheck,
  Home,
  FileText,
  Receipt,
  User: Users,
  HelpCircle
};

export const Sidebar: React.FC<SidebarProps> = ({
  portalType,
  currentRole,
  currentTab,
  onTabChange,
  activeStaffUser,
  staffUsers = [],
  onSelectStaffUser,
  roles = DEFAULT_STAFF_ROLE_TEMPLATES,
  isOpenMobile = false,
  onCloseMobile = () => {}
}) => {
  const accountType = currentRole === 'Superadmin' ? 'Super Admin' :
                      currentRole === 'Admin' ? 'Admin' :
                      currentRole === 'Parent' ? 'Parent' : 'Staff';

  const assignedRoles = activeStaffUser?.assigned_roles || ['Finance Head / Controller'];
  const effectiveMenus: MenuItem[] = resolveEffectiveMenus(
    accountType,
    assignedRoles,
    roles,
    activeStaffUser?.user_overrides
  );

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeParent = effectiveMenus.find(
      m => m.id === currentTab || m.submenus.some(s => s.id === currentTab)
    );
    if (activeParent && activeParent.id !== 'dashboard_menu' && activeParent.id !== 'sa_dashboard_menu') {
      setExpandedMenus(prev => (prev[activeParent.id] ? prev : { ...prev, [activeParent.id]: true }));
    }
  }, [currentTab, currentRole]);

  const toggleMenuExpand = (menuId: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <>
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 h-full bg-[#352331] text-slate-200 border-r border-[#4A3245] flex flex-col shrink-0 shadow-md transition-transform duration-200 ease-in-out
      `}>
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-[#4A3245] flex items-center justify-between bg-[#281A26]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs bg-[#8B3552] border border-[#C5A572]/40">
              {currentRole === 'Superadmin' && <ShieldCheck className="w-4 h-4 text-[#C5A572]" />}
              {currentRole === 'Admin' && <Building className="w-4 h-4 text-[#C5A572]" />}
              {currentRole === 'Staff' && <Users className="w-4 h-4 text-[#C5A572]" />}
              {currentRole === 'Parent' && <GraduationCap className="w-4 h-4 text-[#C5A572]" />}
            </div>
            
            <div className="truncate">
              <div className="text-xs font-bold text-white tracking-tight truncate">
                {currentRole === 'Superadmin' && 'Super Admin Console'}
                {currentRole === 'Admin' && 'Branch Admin ERP'}
                {currentRole === 'Staff' && 'Staff Operational Portal'}
                {currentRole === 'Parent' && 'Parent Guardian Portal'}
              </div>
              <div className="text-[10px] font-semibold text-[#C5A572] truncate">
                {currentRole === 'Staff' ? (activeStaffUser?.assigned_roles?.[0] || 'Staff Member') : 'Green Valley Educational Trust'}
              </div>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#4A3245]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Staff Role Switcher Banner */}
        {currentRole === 'Staff' && (
          <div className="p-3 bg-[#432E41] border-b border-[#4A3245]">
            <div className="text-[10px] font-bold text-[#C5A572] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Simulate Staff Role</span>
              <span className="bg-[#8B3552] text-white px-1.5 py-0.2 rounded text-[9px] font-mono">8 Templates</span>
            </div>
            <select
              value={activeStaffUser?.user_id}
              onChange={(e) => {
                const found = staffUsers.find(u => u.user_id === e.target.value);
                if (found && onSelectStaffUser) onSelectStaffUser(found);
              }}
              className="w-full bg-[#281A26] border border-[#C5A572]/40 text-white font-bold text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#C5A572]"
            >
              {staffUsers.filter(u => u.role_id === 'Staff').map(u => (
                <option key={u.user_id} value={u.user_id} className="bg-[#352331] text-white">
                  {u.full_name} ({u.assigned_roles?.[0] || 'Staff'})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-300 mt-1 leading-tight font-medium">
              Sidebar filters automatically to this role's permitted submenus.
            </p>
          </div>
        )}

        {/* Navigation Tree */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {effectiveMenus.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <Shield className="w-8 h-8 mx-auto text-[#C5A572] mb-2 opacity-70" />
              <div className="font-semibold text-white">No Permitted Screens</div>
              <div className="text-[11px] mt-1 text-slate-400">Contact administrator to assign role permissions.</div>
            </div>
          ) : (
            effectiveMenus.map(menu => {
              const Icon = ICON_MAP[menu.iconName] || LayoutDashboard;
              const isDirectDashboard = menu.id === 'dashboard_menu' || menu.id === 'sa_dashboard_menu';
              const targetTabId = menu.submenus[0]?.id || menu.id;
              const hasActiveSub = menu.submenus.some(s => s.id === currentTab) || currentTab === menu.id;
              const isExpanded = !isDirectDashboard && (expandedMenus[menu.id] ?? hasActiveSub);

              return (
                <div key={menu.id} className="space-y-0.5">
                  <button
                    onClick={() => {
                      if (isDirectDashboard) {
                        onTabChange(targetTabId);
                        if (window.innerWidth < 1024) onCloseMobile();
                      } else if (menu.submenus.length === 1) {
                        onTabChange(targetTabId);
                        setExpandedMenus(prev => ({ ...prev, [menu.id]: true }));
                        if (window.innerWidth < 1024) onCloseMobile();
                      } else {
                        const willExpand = !isExpanded;
                        toggleMenuExpand(menu.id);
                        if (willExpand && !hasActiveSub && targetTabId) {
                          onTabChange(targetTabId);
                        }
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      hasActiveSub
                        ? 'bg-[#8B3552] text-white font-bold shadow-xs border-l-2 border-[#C5A572]'
                        : 'text-slate-300 hover:bg-[#432E41] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${hasActiveSub ? 'text-[#C5A572]' : 'text-slate-400'}`} />
                      <span className="truncate">{menu.title}</span>
                    </div>
                    {!isDirectDashboard && (
                      <div className="flex items-center space-x-1 shrink-0">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    )}
                  </button>

                  {/* Submenu List */}
                  {isExpanded && (
                    <div className="pl-7 pr-1 space-y-0.5 py-1 border-l border-[#4A3245] ml-4">
                      {menu.submenus.map(sub => {
                        const isSubActive = currentTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onTabChange(sub.id);
                              if (window.innerWidth < 1024) onCloseMobile();
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition truncate flex items-center justify-between ${
                              isSubActive
                                ? 'bg-[#8B3552] text-white font-bold shadow-xs'
                                : 'text-slate-300 hover:bg-[#432E41] hover:text-white font-medium'
                            }`}
                          >
                            <span className="truncate">• {sub.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#4A3245] bg-[#281A26] text-[11px] text-slate-400 flex items-center justify-between">
          <div>
            <span className="font-semibold text-white">Green Valley ERP</span>
            <div className="text-[10px] text-[#C5A572] font-mono">Burgundy & Champagne Theme</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Online & Synced"></span>
        </div>
      </aside>
    </>
  );
};
