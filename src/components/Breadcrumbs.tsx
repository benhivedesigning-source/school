import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { MASTER_ADMIN_MENUS, SUPER_ADMIN_MENUS, PARENT_MENUS } from '../permissions/permissionCatalogue';

interface BreadcrumbsProps {
  currentRole: string;
  currentTab: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentRole, currentTab }) => {
  let menuTitle = 'Dashboard';
  let submenuTitle = 'Branch Command Center';
  let foundExact = false;

  const allMenus = currentRole === 'Superadmin' 
    ? SUPER_ADMIN_MENUS 
    : currentRole === 'Parent' 
    ? PARENT_MENUS 
    : MASTER_ADMIN_MENUS;

  for (const m of allMenus) {
    if (m.id === currentTab) {
      menuTitle = m.title;
      submenuTitle = m.submenus[0]?.title || 'Overview';
      foundExact = true;
      break;
    }
    const foundSub = m.submenus.find(s => s.id === currentTab);
    if (foundSub) {
      menuTitle = m.title;
      submenuTitle = foundSub.title;
      foundExact = true;
      break;
    }
  }

  // Fallback prefix matches only if not matched in menu catalogue
  if (!foundExact) {
    if (currentTab.startsWith('pay_')) { menuTitle = 'Payroll'; submenuTitle = 'Payroll & Attendance'; }
    else if (currentTab.startsWith('acc_')) { menuTitle = 'Accounting Setup'; submenuTitle = 'Accounting & Vouchers'; }
    else if (currentTab.startsWith('sf_')) { menuTitle = 'Student Finance'; submenuTitle = 'Fees & Receipts'; }
    else if (currentTab.startsWith('bnk_')) { menuTitle = 'Banking'; submenuTitle = 'Reconciliation & Accounts'; }
    else if (currentTab.startsWith('prc_')) { menuTitle = 'Procurement'; submenuTitle = 'Vendors & Payables'; }
    else if (currentTab.startsWith('sm_') || currentTab.startsWith('role_') || currentTab.startsWith('perm_')) { menuTitle = 'Staff & Access Control'; submenuTitle = 'Directory & Permissions'; }
    else if (currentTab.startsWith('org_')) { menuTitle = 'Organisation & Branch'; submenuTitle = 'Campuses & Legal Trusts'; }
    else if (currentTab.startsWith('tax_')) { menuTitle = 'Tax & Compliance'; submenuTitle = 'GST & TDS Filings'; }
    else if (currentTab.startsWith('rep_')) { menuTitle = 'Reports'; submenuTitle = 'Financial Statements'; }
    else if (currentTab.startsWith('parent_')) { menuTitle = 'Parent Portal'; submenuTitle = 'Child Fees & Payment Gateway'; }
    else if (currentTab.startsWith('sa_')) { menuTitle = 'Super Admin Console'; submenuTitle = 'Platform Control'; }
  }

  return (
    <div className="px-6 sm:px-8 pt-5 pb-0 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <div className="flex items-center space-x-2 min-w-0">
        <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <span className="font-semibold text-slate-600 truncate">{menuTitle}</span>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <span className="font-bold text-burgundy-800 bg-burgundy-50 px-2.5 py-0.5 rounded-md border border-burgundy-200 whitespace-nowrap">
          {submenuTitle}
        </span>
      </div>

      <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono shrink-0">
        <span>Scope:</span>
        <span className="text-burgundy-700 font-bold">
          {currentRole === 'Superadmin' ? 'Global Platform' : currentRole === 'Parent' ? 'Linked Children' : 'Assigned Campus'}
        </span>
      </div>
    </div>
  );
};
