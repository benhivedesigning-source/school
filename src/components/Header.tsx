import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Shield, 
  Bell, 
  Globe, 
  Check, 
  ExternalLink,
  Sparkles,
  Menu,
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { DemoRole, PortalType, Company, Branch, FinancialYear, UserProfile } from '../types';

interface HeaderProps {
  currentRole: DemoRole;
  onRoleChange: (role: DemoRole) => void;
  portalType: PortalType;
  onPortalTypeToggle: (type: PortalType) => void;
  companies: Company[];
  selectedCompany: Company;
  onCompanyChange: (company: Company) => void;
  branches: Branch[];
  selectedBranch: Branch;
  onBranchChange: (branch: Branch) => void;
  financialYears: FinancialYear[];
  selectedFy: FinancialYear;
  onFyChange: (fy: FinancialYear) => void;
  onToggleMobileMenu?: () => void;
  activeStaffUser?: UserProfile;
  staffUsers?: UserProfile[];
  onSelectStaffUser?: (user: UserProfile) => void;
  onLogout?: () => void;
}

const ALL_ROLES: { id: DemoRole; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Superadmin', label: 'Super Admin', desc: 'Platform tenant creation, branches & subscriptions', icon: ShieldCheck },
  { id: 'Admin', label: 'Admin', desc: 'Branch authority, full accounting, HR & permissions', icon: Building2 },
  { id: 'Staff', label: 'Staff Portal', desc: 'Shared staff portal (8 default role templates)', icon: Users },
  { id: 'Parent', label: 'Parent Portal', desc: 'Child fee view, online pay & instant receipts', icon: GraduationCap }
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  portalType,
  onPortalTypeToggle,
  companies,
  selectedCompany,
  onCompanyChange,
  branches,
  selectedBranch,
  onBranchChange,
  financialYears,
  selectedFy,
  onFyChange,
  onToggleMobileMenu,
  activeStaffUser,
  staffUsers = [],
  onSelectStaffUser,
  onLogout
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);

  return (
    <header className="bg-white text-slate-800 border-b border-[#C5A572]/30 shrink-0 z-30 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#FAF7F3] transition"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5 text-[#8B3552]" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B3552] to-[#C5A572] flex items-center justify-center shadow-xs shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">Green Valley</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#8B3552]/10 text-[#8B3552] font-bold border border-[#8B3552]/30">
                  ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">School Finance & Accounting</p>
            </div>
          </div>
        </div>

        {/* Middle: Context Selectors (Admin / Superadmin only) */}
        {currentRole !== 'Parent' && (
          <div className="hidden md:flex items-center space-x-2.5 text-xs">
            {/* Organisation Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowCompanyMenu(!showCompanyMenu); setShowBranchMenu(false); setShowRoleMenu(false); }}
                className="flex items-center space-x-1.5 bg-[#FAF7F3] hover:bg-[#FAF7F3]/80 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 transition shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#8B3552]" />
                <span className="truncate max-w-[130px]">{selectedCompany.display_name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCompanyMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-700">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Legal Entity</div>
                  {companies.map(c => (
                    <button
                      key={c.company_id}
                      onClick={() => { onCompanyChange(c); setShowCompanyMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#8B3552]/10 hover:text-[#8B3552] flex items-center justify-between transition text-xs font-medium"
                    >
                      <span className="truncate">{c.display_name}</span>
                      {selectedCompany.company_id === c.company_id && <Check className="w-3.5 h-3.5 text-[#8B3552]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Branch Selector */}
            <div className="relative">
              <button 
                onClick={() => { setShowBranchMenu(!showBranchMenu); setShowCompanyMenu(false); setShowRoleMenu(false); }}
                className="flex items-center space-x-1.5 bg-[#FAF7F3] hover:bg-[#FAF7F3]/80 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 transition shadow-2xs"
              >
                <span className="truncate max-w-[130px]">{selectedBranch.branch_name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBranchMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-slate-700">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Campus / Branch</div>
                  {branches.map(b => (
                    <button
                      key={b.branch_id}
                      onClick={() => { onBranchChange(b); setShowBranchMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#8B3552]/10 hover:text-[#8B3552] flex items-center justify-between transition text-xs font-medium"
                    >
                      <span className="truncate">{b.branch_name}</span>
                      {selectedBranch.branch_id === b.branch_id && <Check className="w-3.5 h-3.5 text-[#8B3552]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Year badge */}
            <span className="px-3 py-2 bg-[#FAF7F3] text-slate-700 font-mono font-bold rounded-xl border border-slate-200 text-[11px] shadow-2xs">
              {selectedFy.year_name}
            </span>
          </div>
        )}

        {/* Right: Role Switcher & User Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Central Role Selector Pill Button */}
          <div className="relative">
            <button
              onClick={() => { setShowRoleMenu(!showRoleMenu); setShowCompanyMenu(false); setShowBranchMenu(false); }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-xs ${
                currentRole === 'Parent'
                  ? 'bg-[#C5A572]/15 border-[#C5A572]/50 text-[#8B3552] hover:bg-[#C5A572]/25'
                  : 'bg-[#8B3552]/10 border-[#8B3552]/30 text-[#8B3552] hover:bg-[#8B3552]/15'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#8B3552]" />
              <span>Role: <strong className="ml-0.5">{currentRole}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B3552]" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-slate-700 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>

                {ALL_ROLES.map(r => {
                  const Icon = r.icon;
                  const isCurrent = currentRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        if (r.id === 'Parent') onPortalTypeToggle('Parent Portal');
                        else onPortalTypeToggle('Admin Portal');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-2.5 ${
                        isCurrent
                          ? 'bg-[#8B3552]/10 border border-[#8B3552]/30 text-[#8B3552] font-bold'
                          : 'hover:bg-[#FAF7F3] text-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${isCurrent ? 'bg-[#8B3552] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold">{r.label}</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#8B3552]" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User info avatar & Logout */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#8B3552]/30 flex items-center justify-center font-bold text-xs text-[#8B3552]" title="Signed in User">
              {currentRole === 'Superadmin' ? 'SI' :
               currentRole === 'Admin' ? 'KR' :
               currentRole === 'Staff' ? (activeStaffUser?.full_name?.substring(0, 2).toUpperCase() || 'ST') : 'MK'}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition"
                title="Sign Out / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
