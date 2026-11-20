import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  BarChart3, 
  History, 
  Settings, 
  Lock, 
  Unlock,
  TrendingUp,
  X,
  FileText,
  Bell,
  Key,
  ShieldAlert,
  Server,
  Download,
  ExternalLink,
  Search,
  Eye
} from 'lucide-react';
import { Company, Branch, PlatformSubscription, SubscriptionHistoryItem, PlatformUser, AuditLog } from '../types';
import { MOCK_SUBSCRIPTIONS, MOCK_SUBSCRIPTION_HISTORY, MOCK_PLATFORM_USERS, MOCK_AUDIT_LOGS } from '../mockData';

interface SuperadminViewProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
  branches: Branch[];
  onAddBranch: (branch: Branch) => void;
  initialTab?: string;
  onNavigate?: (tab: string) => void;
}

export const SuperadminView: React.FC<SuperadminViewProps> = ({
  companies,
  onAddCompany,
  branches,
  onAddBranch,
  initialTab = 'sa_dashboard',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    onNavigate?.(tab);
  };
  const [subscriptions, setSubscriptions] = useState<PlatformSubscription[]>(MOCK_SUBSCRIPTIONS);
  const [subscriptionHistory] = useState<SubscriptionHistoryItem[]>(MOCK_SUBSCRIPTION_HISTORY);
  const [subHistorySearch, setSubHistorySearch] = useState<string>('');
  const [subHistoryOrgFilter, setSubHistoryOrgFilter] = useState<string>('all');
  const [subHistoryEventFilter, setSubHistoryEventFilter] = useState<string>('all');
  const [selectedSubReceipt, setSelectedSubReceipt] = useState<SubscriptionHistoryItem | null>(null);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(MOCK_PLATFORM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBackupHistoryModal, setShowBackupHistoryModal] = useState(false);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [backupHistory, setBackupHistory] = useState([
    {
      backup_id: 'BKP-20261120-0200',
      timestamp: '2026-11-20 02:00:00',
      backup_type: 'Automated Daily Snapshot',
      scope: 'Full Multi-Tenant Ledger & Config',
      size: '4.24 GB',
      triggered_by: 'System Scheduler',
      checksum: 'sha256:8f9c2a...41e0',
      status: 'Verified' as const
    },
    {
      backup_id: 'BKP-20261119-0200',
      timestamp: '2026-11-19 02:00:00',
      backup_type: 'Automated Daily Snapshot',
      scope: 'Full Multi-Tenant Ledger & Config',
      size: '4.21 GB',
      triggered_by: 'System Scheduler',
      checksum: 'sha256:3b7e10...9c24',
      status: 'Verified' as const
    },
    {
      backup_id: 'BKP-20261118-1645',
      timestamp: '2026-11-18 16:45:12',
      backup_type: 'Manual Pre-Config Snapshot',
      scope: 'Platform Security & MFA Settings',
      size: '128 MB',
      triggered_by: 'Dr. Subramanian Iyer',
      checksum: 'sha256:6a4d88...12b7',
      status: 'Verified' as const
    },
    {
      backup_id: 'BKP-20261118-0200',
      timestamp: '2026-11-18 02:00:00',
      backup_type: 'Automated Daily Snapshot',
      scope: 'Full Multi-Tenant Ledger & Config',
      size: '4.19 GB',
      triggered_by: 'System Scheduler',
      checksum: 'sha256:1d2c77...88f1',
      status: 'Verified' as const
    }
  ]);

  // Settings State
  const [platformSettings, setPlatformSettings] = useState({
    systemName: 'Green Valley Cloud ERP Engine',
    sessionTimeoutMins: 30,
    mfaEnforced: true,
    ipAllowlist: '169.254.0.0/16, 127.0.0.1',
    smtpHost: 'smtp.sendgrid.net',
    supportEmail: 'cloud-support@greenvalley.edu'
  });

  // New Company Form State
  const [newCompany, setNewCompany] = useState({
    displayName: '',
    legalName: '',
    companyCode: '',
    entityType: 'Trust',
    booksBeginningDate: '2026-04-01'
  });

  // New Branch Form State
  const [newBranch, setNewBranch] = useState({
    branchName: '',
    branchCode: '',
    companyId: companies[0]?.company_id || '',
    branchType: 'Campus' as 'Head Office' | 'Campus' | 'Regional Office',
    isHeadOffice: false,
    adminName: '',
    adminEmail: '',
    adminPhone: ''
  });

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.displayName || !newCompany.companyCode) return;

    const created: Company = {
      company_id: `comp-${Date.now()}`,
      organisation_id: 'org-001',
      company_code: newCompany.companyCode.toUpperCase(),
      legal_name: newCompany.legalName || newCompany.displayName,
      display_name: newCompany.displayName,
      entity_type: newCompany.entityType,
      base_currency: 'INR',
      books_beginning_date: newCompany.booksBeginningDate,
      company_status: 'Active'
    };

    onAddCompany(created);
    setShowCompanyModal(false);
    setNewCompany({
      displayName: '',
      legalName: '',
      companyCode: '',
      entityType: 'Trust',
      booksBeginningDate: '2026-04-01'
    });
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.branchName || !newBranch.branchCode) return;

    const created: Branch = {
      branch_id: `branch-${Date.now()}`,
      company_id: newBranch.companyId || companies[0]?.company_id || 'comp-001',
      branch_code: newBranch.branchCode.toUpperCase(),
      branch_name: newBranch.branchName,
      branch_type: newBranch.branchType,
      is_head_office: newBranch.isHeadOffice,
      branch_status: 'Active',
      branch_admin_name: newBranch.adminName || 'Designated Branch Admin',
      branch_admin_email: newBranch.adminEmail || 'admin@campus.edu',
      branch_admin_phone: newBranch.adminPhone || '+91 98400 00000'
    };

    onAddBranch(created);
    setShowBranchModal(false);
    setNewBranch({
      branchName: '',
      branchCode: '',
      companyId: companies[0]?.company_id || '',
      branchType: 'Campus',
      isHeadOffice: false,
      adminName: '',
      adminEmail: '',
      adminPhone: ''
    });
  };

  const handleToggleLockUser = (userId: string) => {
    setPlatformUsers(platformUsers.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Locked' ? 'Active' : 'Locked';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. DASHBOARD & OVERVIEW */}
      {(activeTab === 'sa_dashboard' || activeTab === 'sa_platform_overview' || activeTab === 'sa_total_orgs' || activeTab === 'sa_total_branches' || activeTab === 'sa_active_subs' || activeTab === 'sa_feature_usage') && (
        <div className="space-y-6">
          {/* Top KPI Strip aligned to Organisation, Branch, Subscription & Platform Users menus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="text-slate-500 text-xs font-semibold">Organisations</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{companies.length} Registered</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Multi-entity trusts active</div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('sa_branch_mgmt')}
              className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors"
            >
              <div className="text-slate-500 text-xs font-semibold">Campus Branches</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{branches.length} Active</div>
              <div className="text-xs text-[#8B3552] mt-1 font-semibold">Branch Management →</div>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('sa_subscription_mgmt')}
              className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors"
            >
              <div className="text-slate-500 text-xs font-semibold">Subscription Billing</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                ₹{subscriptions.reduce((sum, s) => sum + s.amount, 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#8B3552] mt-1 font-semibold">{subscriptions.length} Active Plans →</div>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('sa_platform_users')}
              className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors"
            >
              <div className="text-slate-500 text-xs font-semibold">Platform Users</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{platformUsers.length} Accounts</div>
              <div className="text-xs text-[#8B3552] mt-1 font-semibold">
                {platformUsers.filter(u => u.status === 'Locked').length} Locked · Review →
              </div>
            </button>
          </div>

          {/* Charts Row: Tenant Subscription Revenue & Branch Capacity + Users & Security Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tenant Subscription Revenue & Branch Capacity</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Annual contract value and licensed campus utilization per trust</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('sa_reports_analytics')}
                  className="text-xs font-semibold text-[#8B3552] hover:underline whitespace-nowrap"
                >
                  Open Tenant Reports →
                </button>
              </div>

              <div className="space-y-4">
                {subscriptions.map(sub => {
                  const maxAmount = Math.max(...subscriptions.map(s => s.amount));
                  const revenueWidth = Math.max(12, Math.round((sub.amount / maxAmount) * 100));
                  const branchPct = Math.round((sub.active_branches_count / sub.max_branches_allowed) * 100);

                  return (
                    <div key={sub.subscription_id} className="space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900">{sub.organisation_name}</span>
                          <span className="text-slate-400 mx-1.5" aria-hidden="true">·</span>
                          <span className="text-slate-500">{sub.plan_name} ({sub.billing_cycle})</span>
                        </div>
                        <div className="font-bold text-slate-900 tabular-nums">
                          ₹{sub.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B3552] rounded-full" style={{ width: `${revenueWidth}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                        <span>Branches Used: {sub.active_branches_count} / {sub.max_branches_allowed} ({branchPct}%)</span>
                        <span>Renewal: {sub.next_renewal_date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Governance & Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Platform Governance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Users, audit trail & security settings</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('sa_branch_mgmt')}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-slate-800">Campuses & Branch Admins</span>
                  <span className="font-bold text-[#8B3552] tabular-nums">{branches.length} Assigned</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('sa_audit_logs')}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-slate-800">Platform Audit Logs</span>
                  <span className="font-bold text-slate-900 tabular-nums">{auditLogs.length} Events</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('sa_platform_settings')}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
                >
                  <span className="font-semibold text-slate-800">Security & MFA Policy</span>
                  <span className="font-bold text-emerald-700">{platformSettings.mfaEnforced ? 'Enforced' : 'Optional'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                <div className="text-slate-500 font-semibold">Latest Audit Event</div>
                <div className="text-slate-700 truncate">{auditLogs[0]?.details}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORGANISATION MANAGEMENT */}
      {(activeTab === 'sa_org_mgmt' || activeTab.startsWith('sa_org_') || activeTab === 'sa_create_org') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Registered Legal Educational Organisations</h3>
              <p className="text-xs text-slate-500 font-medium">Independent trust companies with separate books of accounts</p>
            </div>
            <button
              onClick={() => setShowCompanyModal(true)}
              className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Organisation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(c => (
              <div key={c.company_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{c.display_name}</h4>
                    <p className="text-xs text-slate-500">{c.legal_name}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.company_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
                  <div>Entity Type: <strong className="text-slate-900">{c.entity_type}</strong></div>
                  <div>Code: <strong className="text-burgundy-700 font-mono">{c.company_code}</strong></div>
                  <div>Currency: <strong className="text-slate-900">{c.base_currency}</strong></div>
                  <div>Books From: <strong className="text-slate-900">{c.books_beginning_date}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BRANCH MANAGEMENT */}
      {(activeTab === 'sa_branch_mgmt' || (activeTab.startsWith('sa_branch_') && activeTab !== 'sa_branch_admin_mgmt') || activeTab === 'sa_create_branch' || activeTab === 'sa_assign_branch_admin') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus Locations & Branch Administration</h3>
              <p className="text-xs text-slate-500 font-medium">Operating campuses mapped to independent balance sheets</p>
            </div>
            <button
              onClick={() => setShowBranchModal(true)}
              className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Campus</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Branch Code</th>
                  <th className="pb-3">Campus Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Assigned Branch Admin</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branches.map(b => (
                  <tr key={b.branch_id} className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{b.branch_code}</td>
                    <td className="py-3.5 font-bold text-slate-900 text-sm">{b.branch_name}</td>
                    <td className="py-3.5 text-slate-600">{b.branch_type}</td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-800">{b.branch_admin_name || 'Kavitha Ranganathan'}</div>
                      <div className="text-[11px] text-slate-400">{b.branch_admin_email || 'admin@campus.edu'}</div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.branch_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SUBSCRIPTION HISTORY & BILLING */}
      {(activeTab === 'sa_subscription_mgmt' || activeTab.startsWith('sa_sub_') || activeTab === 'sa_billing_history' || activeTab === 'sa_renewals') && (() => {
        const filteredHistory = subscriptionHistory.filter(item => {
          const matchesOrg = subHistoryOrgFilter === 'all' || item.organisation_name === subHistoryOrgFilter;
          const matchesEvent = subHistoryEventFilter === 'all' || item.event_type === subHistoryEventFilter;
          const q = subHistorySearch.trim().toLowerCase();
          const matchesSearch = !q ||
            item.invoice_number.toLowerCase().includes(q) ||
            item.organisation_name.toLowerCase().includes(q) ||
            item.plan_name.toLowerCase().includes(q) ||
            item.payment_reference.toLowerCase().includes(q);
          return matchesOrg && matchesEvent && matchesSearch;
        });

        const totalHistoricalBilled = filteredHistory.reduce((sum, h) => sum + h.amount, 0);
        const renewalsAndUpgrades = filteredHistory.filter(h => h.event_type === 'Renewal' || h.event_type === 'Plan Upgrade').length;
        const uniqueOrgs = Array.from(new Set(subscriptionHistory.map(h => h.organisation_name)));

        const handleExportHistoryCsv = () => {
          const headers = ['Invoice #', 'Billing Date', 'Organisation', 'Plan', 'Billing Cycle', 'Event Type', 'Coverage Period', 'Branches Licensed', 'Payment Method', 'Reference', 'Amount (INR)', 'Status'];
          const rows = filteredHistory.map(h => [
            h.invoice_number,
            h.billing_date,
            `"${h.organisation_name}"`,
            `"${h.plan_name}"`,
            h.billing_cycle,
            h.event_type,
            `${h.period_start} to ${h.period_end}`,
            h.branches_licensed,
            `"${h.payment_method}"`,
            h.payment_reference,
            h.amount,
            h.status
          ].join(','));
          const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'subscription_billing_history.csv';
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <div className="space-y-6">
            {/* Historical Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-slate-500 text-xs font-semibold">Cumulative Subscription Revenue</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                  ₹{totalHistoricalBilled.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-1 tabular-nums">
                  Across {filteredHistory.length} billing records
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-slate-500 text-xs font-semibold">Renewals & Plan Upgrades</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{renewalsAndUpgrades} Events</div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">100% On-Time Retention</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <div className="text-slate-500 text-xs font-semibold">Next Scheduled Renewal</div>
                <div className="text-2xl font-bold text-[#8B3552] mt-1 tabular-nums">2026-12-31</div>
                <div className="text-xs text-slate-500 mt-1">Delhi Public School Foundation (Quarterly)</div>
              </div>
            </div>

            {/* Subscription History Ledger Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Subscription History</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological ledger of tenant renewals, plan upgrades, invoices, and payment settlements
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportHistoryCsv}
                  className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                  <div className="relative flex-1 min-w-[210px] max-w-sm">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={subHistorySearch}
                      onChange={(e) => setSubHistorySearch(e.target.value)}
                      placeholder="Search invoice #, organisation, or ref..."
                      className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#8B3552]"
                    />
                  </div>
                  <select
                    aria-label="Filter by Organisation"
                    value={subHistoryOrgFilter}
                    onChange={(e) => setSubHistoryOrgFilter(e.target.value)}
                    className="bg-[#FAF7F3] border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#8B3552]"
                  >
                    <option value="all">All Organisations</option>
                    {uniqueOrgs.map(org => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FAF7F3] border border-slate-200 rounded-lg text-xs">
                  {['all', 'Renewal', 'Plan Upgrade', 'Quarterly Billing', 'New Subscription'].map(evt => (
                    <button
                      key={evt}
                      type="button"
                      onClick={() => setSubHistoryEventFilter(evt)}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                        subHistoryEventFilter === evt
                          ? 'bg-[#8B3552] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {evt === 'all' ? 'All Events' : evt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscription History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                      <th className="pb-3 pr-3">Invoice #</th>
                      <th className="pb-3 pr-3">Billing Date</th>
                      <th className="pb-3 pr-3">Organisation & Plan</th>
                      <th className="pb-3 pr-3">Coverage Period</th>
                      <th className="pb-3 pr-3">Event Type</th>
                      <th className="pb-3 pr-3">Payment Method</th>
                      <th className="pb-3 pr-3 text-right">Amount (₹)</th>
                      <th className="pb-3 pr-3 text-center">Status</th>
                      <th className="pb-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-slate-500">
                          No subscription history records match the active filters.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map(item => (
                        <tr key={item.history_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                          <td className="py-3.5 pr-3 font-mono font-bold text-[#8B3552] whitespace-nowrap">
                            {item.invoice_number}
                          </td>
                          <td className="py-3.5 pr-3 text-slate-600 tabular-nums whitespace-nowrap">
                            {item.billing_date}
                          </td>
                          <td className="py-3.5 pr-3 min-w-[200px]">
                            <div className="font-bold text-slate-900">{item.organisation_name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {item.plan_name} · {item.billing_cycle} · {item.branches_licensed} Branches
                            </div>
                          </td>
                          <td className="py-3.5 pr-3 text-slate-600 tabular-nums whitespace-nowrap">
                            {item.period_start} → {item.period_end}
                          </td>
                          <td className="py-3.5 pr-3 font-semibold text-slate-800 whitespace-nowrap">
                            {item.event_type}
                          </td>
                          <td className="py-3.5 pr-3 whitespace-nowrap">
                            <div className="font-medium text-slate-800">{item.payment_method}</div>
                            <div className="text-[11px] font-mono text-slate-400">{item.payment_reference}</div>
                          </td>
                          <td className="py-3.5 pr-3 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 pr-3 text-center whitespace-nowrap">
                            <span className={`font-semibold ${
                              item.status === 'Paid' || item.status === 'Renewed'
                                ? 'text-emerald-700'
                                : item.status === 'Pending'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedSubReceipt(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-[#FAF7F3] text-slate-700 font-semibold transition-colors"
                            >
                              <Eye className="w-3 h-3 text-[#8B3552]" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. BRANCH ADMIN MANAGEMENT */}
      {(activeTab === 'sa_branch_admin_mgmt' || activeTab.startsWith('sa_admin_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Branch Administrator Authorities</h3>
              <p className="text-xs text-slate-500 font-medium">Assign administrators to legal campuses and manage elevated permissions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Admin Name</th>
                  <th className="pb-3">Email & Contact</th>
                  <th className="pb-3">Assigned Campuses</th>
                  <th className="pb-3">Role Authority</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branches.map(b => (
                  <tr key={b.branch_id} className="hover:bg-[#FAF7F3]">
                    <td className="py-3.5 font-bold text-slate-900 text-sm">{b.branch_admin_name || 'Kavitha Ranganathan'}</td>
                    <td className="py-3.5">
                      <div className="font-medium text-slate-800">{b.branch_admin_email || 'admin@campus.edu'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{b.branch_admin_phone || '+91 98400 11001'}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                        {b.branch_name}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-700">Chief Branch Admin</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PLATFORM USERS WITH LOCK / UNLOCK */}
      {(activeTab === 'sa_platform_users' || activeTab.startsWith('sa_all_users') || activeTab === 'sa_user_status' || activeTab === 'sa_account_lock_unlock') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Platform User Security & Access Status</h3>
              <p className="text-xs text-slate-500 font-medium">Manage user credentials, session state, and security account lock/unlock</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">User Name & Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Campus / Organisation</th>
                  <th className="pb-3">Last Active</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Security Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {platformUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{u.email}</div>
                    </td>
                    <td className="py-3.5 font-semibold text-burgundy-700">{u.role}</td>
                    <td className="py-3.5 text-slate-600">{u.branch}</td>
                    <td className="py-3.5 text-slate-500">{u.last_login}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleLockUser(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1 ${
                          u.status === 'Locked'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {u.status === 'Locked' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{u.status === 'Locked' ? 'Unlock Account' : 'Lock Account'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. REPORTS & ANALYTICS */}
      {(activeTab === 'sa_reports_analytics' || activeTab.startsWith('sa_org_reports') || activeTab === 'sa_branch_reports' || activeTab === 'sa_sub_reports' || activeTab === 'sa_usage_reports') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Platform Analytics & Global Consolidated Reports</h3>
              <p className="text-xs text-slate-500 font-medium">Cross-campus enrollment, fee liquidity, and cloud infrastructure usage</p>
            </div>
            <button
              onClick={() => alert('Platform Analytics Report exported as XLSX.')}
              className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Analytics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2">
              <div className="text-slate-400 text-xs font-bold uppercase">Total Consolidated Collections</div>
              <div className="text-2xl font-bold text-slate-900">₹2.48 Crore</div>
              <p className="text-[11px] text-slate-500">Across Chennai, Coimbatore & Bengaluru campuses</p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2">
              <div className="text-slate-400 text-xs font-bold uppercase">Total Faculty On Roster</div>
              <div className="text-2xl font-bold text-slate-900">184 Employees</div>
              <p className="text-[11px] text-slate-500">97.8% Average biometric attendance rate</p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2">
              <div className="text-slate-400 text-xs font-bold uppercase">Multi-Tenant Database Size</div>
              <div className="text-2xl font-bold text-slate-900">4.2 GB / 50 GB</div>
              <p className="text-[11px] text-emerald-700 font-bold">Automated daily backup synced</p>
            </div>
          </div>
        </div>
      )}

      {/* 8. AUDIT LOGS */}
      {(activeTab === 'sa_audit_logs' || activeTab.startsWith('sa_platform_activities') || activeTab === 'sa_org_changes' || activeTab === 'sa_feature_changes' || activeTab === 'sa_admin_activities') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Super Administrator Immutable Audit Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Actor / Admin</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Module</th>
                  <th className="pb-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map(log => (
                  <tr key={log.audit_log_id} className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3.5 font-bold text-slate-900">{log.user_name}</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{log.action_type}</span></td>
                    <td className="py-3.5 font-semibold text-burgundy-700">{log.module}</td>
                    <td className="py-3.5 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. PLATFORM SETTINGS */}
      {(activeTab === 'sa_platform_settings' || activeTab.startsWith('sa_general_settings') || activeTab === 'sa_notification_settings' || activeTab === 'sa_security_settings') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Global Platform Configuration & Security Parameters</h3>
            <p className="text-xs text-slate-500 font-medium">Session timeouts, multi-factor authentication, and notification relays</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <Settings className="w-4 h-4 text-burgundy-600" />
                <span>General Engine Settings</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={platformSettings.systemName}
                    onChange={e => setPlatformSettings({ ...platformSettings, systemName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Session Inactivity Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={platformSettings.sessionTimeoutMins}
                    onChange={e => setPlatformSettings({ ...platformSettings, sessionTimeoutMins: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="w-4 h-4 text-burgundy-600" />
                <span>Security & Access Control</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700">Enforce MFA for Administrators</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">IP Allowlist CIDRs</label>
                  <input
                    type="text"
                    value={platformSettings.ipAllowlist}
                    onChange={e => setPlatformSettings({ ...platformSettings, ipAllowlist: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end items-center gap-3">
            {settingsSavedNotice && (
              <span className="text-xs font-semibold text-emerald-700 mr-auto">
                Platform configuration saved successfully.
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSettingsSavedNotice(true);
                setTimeout(() => setSettingsSavedNotice(false), 3000);
              }}
              className="px-5 py-2.5 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs whitespace-nowrap shrink-0 transition-colors"
            >
              Save Platform Configuration
            </button>
            <button
              type="button"
              onClick={() => setShowBackupHistoryModal(true)}
              className="px-5 py-2.5 bg-[#FAF7F3] hover:bg-champagne-100/70 border border-[#C5A572] text-slate-800 font-bold rounded-xl text-xs shadow-xs flex items-center space-x-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-[#8B3552]" />
              <span>Backup History</span>
            </button>
          </div>
        </div>
      )}

      {/* CREATE ORGANISATION MODAL */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Provision Legal Educational Entity</h3>
                <p className="text-xs text-slate-500 font-medium">Create a new legal entity with dedicated chart of accounts</p>
              </div>
              <button onClick={() => setShowCompanyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.displayName}
                  onChange={e => setNewCompany({ ...newCompany, displayName: e.target.value })}
                  placeholder="Green Valley Sports Academy"
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Code (Unique Tenant Prefix)</label>
                <input
                  type="text"
                  required
                  value={newCompany.companyCode}
                  onChange={e => setNewCompany({ ...newCompany, companyCode: e.target.value })}
                  placeholder="GVET-SPORTS"
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Entity Type</label>
                  <select
                    value={newCompany.entityType}
                    onChange={e => setNewCompany({ ...newCompany, entityType: e.target.value })}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                  >
                    <option value="Trust">Trust</option>
                    <option value="Society">Society</option>
                    <option value="Section 8 Company">Section 8 Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Base Currency</label>
                  <input type="text" value="INR (₹)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-500 font-bold" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowCompanyModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs">
                  Provision Organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BRANCH & BRANCH ADMIN MODAL */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Campus & Assign Branch Admin</h3>
                <p className="text-xs text-slate-500 font-medium">Designate the chief branch administrator for this campus</p>
              </div>
              <button onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Campus Name</label>
                  <input
                    type="text"
                    required
                    value={newBranch.branchName}
                    onChange={e => setNewBranch({ ...newBranch, branchName: e.target.value })}
                    placeholder="e.g. Coimbatore Campus"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={newBranch.branchCode}
                    onChange={e => setNewBranch({ ...newBranch, branchCode: e.target.value })}
                    placeholder="CBE-02"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Parent Legal Entity</label>
                <select
                  value={newBranch.companyId}
                  onChange={e => setNewBranch({ ...newBranch, companyId: e.target.value })}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                >
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>{c.display_name}</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-burgundy-50/50 rounded-xl border border-burgundy-100 space-y-3">
                <div className="font-bold text-burgundy-900">Designate Branch Administrator</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Admin Full Name"
                    value={newBranch.adminName}
                    onChange={e => setNewBranch({ ...newBranch, adminName: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg p-2"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Admin Email"
                    value={newBranch.adminEmail}
                    onChange={e => setNewBranch({ ...newBranch, adminEmail: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs">
                  Create Campus & Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION HISTORY INVOICE RECEIPT MODAL */}
      {selectedSubReceipt && (() => {
        const baseLicenseAmount = Math.round(selectedSubReceipt.amount / 1.18);
        const gstAmount = selectedSubReceipt.amount - baseLicenseAmount;
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono font-bold text-[#8B3552] text-sm">{selectedSubReceipt.invoice_number}</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Subscription Billing Receipt</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedSubReceipt.organisation_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubReceipt(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF7F3] border border-slate-200">
                <div>
                  <div className="text-slate-500">Plan Tier</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSubReceipt.plan_name}</div>
                </div>
                <div>
                  <div className="text-slate-500">Event Type</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSubReceipt.event_type}</div>
                </div>
                <div>
                  <div className="text-slate-500">Billing Date</div>
                  <div className="font-bold text-slate-900 mt-0.5 tabular-nums">{selectedSubReceipt.billing_date}</div>
                </div>
                <div>
                  <div className="text-slate-500">Coverage Period</div>
                  <div className="font-bold text-slate-900 mt-0.5 tabular-nums">
                    {selectedSubReceipt.period_start} to {selectedSubReceipt.period_end}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Payment Mode</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSubReceipt.payment_method}</div>
                </div>
                <div>
                  <div className="text-slate-500">Transaction Ref</div>
                  <div className="font-mono font-bold text-[#8B3552] mt-0.5">{selectedSubReceipt.payment_reference}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>Platform License ({selectedSubReceipt.billing_cycle} · up to {selectedSubReceipt.branches_licensed} branches)</span>
                  <span className="font-semibold text-slate-900">₹{baseLicenseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IGST / CGST+SGST (18%)</span>
                  <span className="font-semibold text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Settled ({selectedSubReceipt.status})</span>
                  <span className="text-[#8B3552]">₹{selectedSubReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-[#FAF7F3] text-slate-700 font-semibold"
                >
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PLATFORM BACKUP HISTORY MODAL */}
      {showBackupHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform Backup History</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated daily database snapshots and manual platform configuration backups
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const stamp = now.toISOString().replace('T', ' ').substring(0, 19);
                    const idSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
                    setBackupHistory(prev => [
                      {
                        backup_id: `BKP-${idSuffix}`,
                        timestamp: stamp,
                        backup_type: 'Manual Pre-Config Snapshot',
                        scope: 'Platform Settings & Multi-Tenant DB',
                        size: '4.25 GB',
                        triggered_by: 'Dr. Subramanian Iyer',
                        checksum: `sha256:${Math.random().toString(16).substring(2, 8)}...f04a`,
                        status: 'Verified'
                      },
                      ...prev
                    ]);
                  }}
                  className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Backup Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBackupHistoryModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="pb-3 pr-3">Snapshot ID</th>
                    <th className="pb-3 pr-3">Timestamp</th>
                    <th className="pb-3 pr-3">Type & Scope</th>
                    <th className="pb-3 pr-3">Triggered By</th>
                    <th className="pb-3 pr-3 text-right">Size</th>
                    <th className="pb-3 pr-3 text-center">Status</th>
                    <th className="pb-3 text-right">Manifest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {backupHistory.map(bkp => (
                    <tr key={bkp.backup_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                      <td className="py-3 pr-3 font-mono font-bold text-[#8B3552] whitespace-nowrap">
                        {bkp.backup_id}
                      </td>
                      <td className="py-3 pr-3 text-slate-600 tabular-nums whitespace-nowrap">
                        {bkp.timestamp}
                      </td>
                      <td className="py-3 pr-3 min-w-[180px]">
                        <div className="font-semibold text-slate-900">{bkp.backup_type}</div>
                        <div className="text-[11px] text-slate-500">{bkp.scope}</div>
                      </td>
                      <td className="py-3 pr-3 text-slate-700 whitespace-nowrap">{bkp.triggered_by}</td>
                      <td className="py-3 pr-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {bkp.size}
                      </td>
                      <td className="py-3 pr-3 text-center whitespace-nowrap">
                        <span className="font-semibold text-emerald-700">{bkp.status}</span>
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            const manifest = JSON.stringify({ ...bkp, platformSettings }, null, 2);
                            const blob = new Blob([manifest], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${bkp.backup_id}_manifest.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-[#FAF7F3] text-slate-700 font-semibold transition-colors"
                        >
                          <Download className="w-3 h-3 text-[#8B3552]" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBackupHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
