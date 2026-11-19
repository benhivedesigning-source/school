import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { MASTER_ADMIN_MENUS, SUPER_ADMIN_MENUS, PARENT_MENUS } from '../permissions/permissionCatalogue';

interface BreadcrumbsProps {
  currentRole: string;
  currentTab: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentRole, currentTab }) => {
  let menuTitle = 'Dashboard';
  let submenuTitle = 'Overview';

  const allMenus = currentRole === 'Superadmin' 
    ? SUPER_ADMIN_MENUS 
    : currentRole === 'Parent' 
    ? PARENT_MENUS 
    : MASTER_ADMIN_MENUS;

  for (const m of allMenus) {
    if (m.id === currentTab) {
      menuTitle = m.title;
      submenuTitle = m.submenus[0]?.title || 'Overview';
      break;
    }
    const foundSub = m.submenus.find(s => s.id === currentTab);
    if (foundSub) {
      menuTitle = m.title;
      submenuTitle = foundSub.title;
      break;
    }
  }

  // Handle prefix matches
  if (currentTab.startsWith('pay_')) { menuTitle = 'Payroll & Attendance'; submenuTitle = 'Attendance, Staff & Salary Runs'; }
  else if (currentTab.startsWith('acc_')) { menuTitle = 'Accounting & Vouchers'; submenuTitle = 'Double Entry & Day Book'; }
  else if (currentTab.startsWith('sf_')) { menuTitle = 'Student Finance & Fees'; submenuTitle = 'Fee Plans, Invoices & Collections'; }
  else if (currentTab.startsWith('bnk_')) { menuTitle = 'Banking & Reconciliation'; submenuTitle = 'Accounts & Statement Matching'; }
  else if (currentTab.startsWith('prc_')) { menuTitle = 'Procurement & Payables'; submenuTitle = 'Vendors, Orders & Bills'; }
  else if (currentTab.startsWith('sm_') || currentTab.startsWith('rm_') || currentTab.startsWith('pm_')) { menuTitle = 'Staff, Roles & Permissions'; submenuTitle = 'Access Control & Directory'; }
  else if (currentTab.startsWith('ob_')) { menuTitle = 'Organisation & Campuses'; submenuTitle = 'Campuses & Legal Trusts'; }
  else if (currentTab.startsWith('tax_')) { menuTitle = 'Tax & Compliance'; submenuTitle = 'GST & TDS Filings'; }
  else if (currentTab.startsWith('bud_')) { menuTitle = 'Budgets & Funds'; submenuTitle = 'Departmental Allocations'; }
  else if (currentTab.startsWith('inv_')) { menuTitle = 'Fixed Assets & Inventory'; submenuTitle = 'Asset Register & Stock'; }
  else if (currentTab.startsWith('rep_')) { menuTitle = 'Financial Reports'; submenuTitle = 'Trial Balance & Statements'; }
  else if (currentTab.startsWith('appr_') || currentTab.startsWith('aud_')) { menuTitle = 'Approvals & Audit Trail'; submenuTitle = 'Maker-Checker Logs'; }
  else if (currentTab.startsWith('p_') || currentTab.startsWith('parent_')) { menuTitle = 'Parent Portal'; submenuTitle = 'Child Fees & Payment Gateway'; }
  else if (currentTab.startsWith('sa_')) { menuTitle = 'Super Admin Console'; submenuTitle = 'Multi-Tenant Platform Control'; }

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
