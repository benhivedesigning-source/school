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
  ExternalLink
} from 'lucide-react';
import { Company, Branch, PlatformSubscription, PlatformUser, AuditLog } from '../types';
import { MOCK_SUBSCRIPTIONS, MOCK_PLATFORM_USERS, MOCK_AUDIT_LOGS } from '../mockData';

interface SuperadminViewProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
  branches: Branch[];
  onAddBranch: (branch: Branch) => void;
  initialTab?: string;
}

export const SuperadminView: React.FC<SuperadminViewProps> = ({
  companies,
  onAddCompany,
  branches,
  onAddBranch,
  initialTab = 'sa_dashboard'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [subscriptions, setSubscriptions] = useState<PlatformSubscription[]>(MOCK_SUBSCRIPTIONS);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(MOCK_PLATFORM_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Organisations</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{companies.length} Registered</div>
              <div className="text-xs text-burgundy-700 mt-1 font-medium">100% Active trusts</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Campuses</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{branches.length} Branches</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Across 3 regional hubs</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Annual Subscription ARR</div>
              <div className="text-2xl font-bold text-burgundy-800 mt-1">₹9,95,000</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">+18% YOY Growth</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-semibold uppercase">Active Platform Users</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{platformUsers.length} Users</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Multi-tenant SSO enabled</div>
            </div>
          </div>

          {/* Feature Usage Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Module & Feature Adoption Across Tenants</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time compute and database telemetry</p>
              </div>
              <span className="text-xs font-bold text-burgundy-700 bg-burgundy-50 px-2.5 py-1 rounded-lg border border-burgundy-200">
                Healthy (100% SLA)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-slate-500 font-medium">Daily Attendance Logged</div>
                <div className="text-xl font-bold text-slate-900">4,820 Punches/day</div>
                <div className="text-emerald-700 font-semibold text-[11px]">Biometric API Active</div>
              </div>
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-slate-500 font-medium">Double-Entry Vouchers</div>
                <div className="text-xl font-bold text-slate-900">12,450 Posted</div>
                <div className="text-burgundy-700 font-semibold text-[11px]">Books in balance</div>
              </div>
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-slate-500 font-medium">Gateway Collections</div>
                <div className="text-xl font-bold text-slate-900">₹1.24 Cr Processed</div>
                <div className="text-champagne-700 font-semibold text-[11px]">Instant settlement sync</div>
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

      {/* 4. SUBSCRIPTION MANAGEMENT */}
      {(activeTab === 'sa_subscription_mgmt' || activeTab.startsWith('sa_sub_') || activeTab === 'sa_billing_history' || activeTab === 'sa_renewals') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Subscription Plans & Multi-Tenant Billing</h3>
              <p className="text-xs text-slate-500 font-medium">Active license tiers, billing history, and contract renewals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptions.map(s => (
              <div key={s.subscription_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200 font-mono">
                    {s.billing_cycle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {s.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{s.organisation_name}</h4>
                  <div className="text-xs font-semibold text-burgundy-700 mt-0.5">{s.plan_name}</div>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tabular-nums">
                  ₹{s.amount.toLocaleString('en-IN')}
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                  <span>Renews: <strong className="text-slate-800">{s.next_renewal_date}</strong></span>
                  <span className="text-burgundy-700 font-semibold">{s.active_branches_count}/{s.max_branches_allowed} Campuses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

          <div className="flex justify-end">
            <button
              onClick={() => alert('Platform Settings updated successfully.')}
              className="px-5 py-2.5 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs"
            >
              Save Platform Configuration
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
    </div>
  );
};
