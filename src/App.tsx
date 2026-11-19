import React, { useState, useEffect } from 'react';
import { 
  PortalType, 
  DemoRole, 
  Company, 
  Branch, 
  FinancialYear, 
  AccountingVoucher, 
  FeeInvoice, 
  FeePayment, 
  AuditLog,
  UserProfile,
  AttendanceRecord,
  RoleDefinition
} from './types';
import { 
  MOCK_COMPANIES, 
  MOCK_BRANCHES, 
  MOCK_FINANCIAL_YEARS, 
  MOCK_USERS, 
  MOCK_ACCOUNT_GROUPS, 
  MOCK_LEDGERS, 
  MOCK_COST_CENTRES, 
  MOCK_VOUCHERS, 
  MOCK_STUDENTS, 
  MOCK_GUARDIANS, 
  MOCK_FEE_PLANS, 
  MOCK_INVOICES, 
  MOCK_PAYMENTS, 
  MOCK_BANK_ACCOUNTS, 
  MOCK_GATEWAYS, 
  MOCK_STATEMENTS, 
  MOCK_VENDORS, 
  MOCK_VENDOR_BILLS, 
  MOCK_EMPLOYEES, 
  MOCK_PAYROLL_RUNS, 
  MOCK_AUDIT_LOGS,
  MOCK_ATTENDANCE 
} from './mockData';
import { DEFAULT_STAFF_ROLE_TEMPLATES, resolveEffectiveMenus } from './permissions/permissionCatalogue';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Dashboard } from './components/Dashboard';
import { SuperadminView } from './components/SuperadminView';
import { StaffManagementView } from './components/StaffManagementView';
import { RolePermissionManagementView } from './components/RolePermissionManagementView';
import { OrganisationView } from './components/OrganisationView';
import { AccountingView } from './components/AccountingView';
import { StudentFinanceView } from './components/StudentFinanceView';
import { BankingView } from './components/BankingView';
import { ProcurementView } from './components/ProcurementView';
import { PayrollView } from './components/PayrollView';
import { AttendanceView } from './components/AttendanceView';
import { AdminOperationsView } from './components/AdminOperationsView';
import { ReportsView } from './components/ReportsView';
import { ApprovalsView } from './components/ApprovalsView';
import { ParentPortalView } from './components/ParentPortalView';
import { LoginView } from './components/LoginView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [portalType, setPortalType] = useState<PortalType>('Admin Portal');
  const [currentRole, setCurrentRole] = useState<DemoRole>('Admin');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Multi-tenant Entities
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_STAFF_ROLE_TEMPLATES);

  // Active Staff User (defaults to Ramesh - Finance Head)
  const [activeStaffUser, setActiveStaffUser] = useState<UserProfile>(
    MOCK_USERS.find(u => u.user_id === 'usr-staff-1') || MOCK_USERS[2]
  );

  const [selectedCompany, setSelectedCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [selectedBranch, setSelectedBranch] = useState<Branch>(MOCK_BRANCHES[0]);
  const [selectedFy, setSelectedFy] = useState<FinancialYear>(MOCK_FINANCIAL_YEARS[0]);

  // Operational Data State
  const [vouchers, setVouchers] = useState<AccountingVoucher[]>(MOCK_VOUCHERS);
  const [invoices, setInvoices] = useState<FeeInvoice[]>(MOCK_INVOICES);
  const [payments, setPayments] = useState<FeePayment[]>(MOCK_PAYMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-switch tabs when changing roles
  const handleRoleChange = (newRole: DemoRole) => {
    setCurrentRole(newRole);
    if (newRole === 'Superadmin') {
      setPortalType('Admin Portal');
      setCurrentTab('sa_dashboard');
    } else if (newRole === 'Parent') {
      setPortalType('Parent Portal');
      setCurrentTab('parent_home');
    } else if (newRole === 'Staff') {
      setPortalType('Admin Portal');
      const staffPermitted = resolveEffectiveMenus('Staff', activeStaffUser?.assigned_roles || ['Finance Head / Controller'], roles);
      if (staffPermitted.length > 0 && staffPermitted[0].submenus.length > 0) {
        setCurrentTab(staffPermitted[0].submenus[0].id);
      } else {
        setCurrentTab('dashboard');
      }
    } else {
      setPortalType('Admin Portal');
      setCurrentTab('dashboard');
    }
  };

  // Switch to specific staff profile
  const handleSwitchToStaffProfile = (staffUser: UserProfile) => {
    setActiveStaffUser(staffUser);
    setCurrentRole('Staff');
    setPortalType('Admin Portal');
    const staffPermitted = resolveEffectiveMenus('Staff', staffUser.assigned_roles || ['Finance Head / Controller'], roles);
    if (staffPermitted.length > 0 && staffPermitted[0].submenus.length > 0) {
      setCurrentTab(staffPermitted[0].submenus[0].id);
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Add Attendance Handler
  const handleAddAttendance = (record: AttendanceRecord) => {
    setAttendanceRecords([record, ...attendanceRecords]);
    const log: AuditLog = {
      audit_log_id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentRole === 'Staff' ? activeStaffUser.full_name : 'Kavitha Ranganathan',
      role: currentRole,
      action_type: 'CREATE',
      module: 'Payroll Attendance',
      details: `Marked attendance for ${record.employee_name} (${record.employee_code}) as ${record.status} on ${record.attendance_date}`
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Update Attendance Handler
  const handleUpdateAttendance = (record: AttendanceRecord) => {
    setAttendanceRecords(attendanceRecords.map(r => r.attendance_id === record.attendance_id ? record : r));
    const log: AuditLog = {
      audit_log_id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentRole === 'Staff' ? activeStaffUser.full_name : 'Kavitha Ranganathan',
      role: currentRole,
      action_type: 'UPDATE',
      module: 'Payroll Attendance',
      details: `Updated attendance for ${record.employee_name} (${record.employee_code}) to ${record.status} on ${record.attendance_date}`
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Bulk Add Attendance Handler
  const handleBulkAddAttendance = (records: AttendanceRecord[]) => {
    setAttendanceRecords([...records, ...attendanceRecords]);
    const log: AuditLog = {
      audit_log_id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentRole === 'Staff' ? activeStaffUser.full_name : 'Kavitha Ranganathan',
      role: currentRole,
      action_type: 'CREATE',
      module: 'Payroll Attendance',
      details: `Bulk marked attendance for ${records.length} faculty employees on ${records[0]?.attendance_date}`
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Generic audit logger helper
  const handleAuditLog = (action: string, moduleName: string, details: string) => {
    const log: AuditLog = {
      audit_log_id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentRole === 'Staff' ? activeStaffUser.full_name : currentRole === 'Superadmin' ? 'Dr. Subramanian Iyer' : 'Kavitha Ranganathan',
      role: currentRole,
      action_type: action as any,
      module: moduleName,
      details
    };
    setAuditLogs([log, ...auditLogs]);
  };

  // Role Add / Update
  const handleAddRole = (newRole: RoleDefinition) => {
    setRoles([...roles, newRole]);
  };

  const handleUpdateRole = (updatedRole: RoleDefinition) => {
    setRoles(roles.map(r => r.roleId === updatedRole.roleId ? updatedRole : r));
  };

  // User Update
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers(users.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
    if (activeStaffUser?.user_id === updatedUser.user_id) {
      setActiveStaffUser(updatedUser);
    }
  };

  const handleAddUser = (newUser: UserProfile) => {
    setUsers([...users, newUser]);
  };

  // Online Fee Payment Handler (Parent Portal)
  const handleMakePayment = (newPay: FeePayment) => {
    setPayments([newPay, ...payments]);
    if (newPay.allocated_invoices?.[0]) {
      const invId = newPay.allocated_invoices[0].fee_invoice_id;
      setInvoices(invoices.map(i => i.fee_invoice_id === invId ? { ...i, invoice_status: 'Paid' } : i));
    }
  };

  // Determine if current user has permission to view currentTab
  const isTabPermitted = () => {
    if (currentRole === 'Superadmin' || currentRole === 'Admin' || currentRole === 'Parent') return true;
    const permittedMenus = resolveEffectiveMenus('Staff', activeStaffUser?.assigned_roles || ['Finance Head / Controller'], roles);
    for (const m of permittedMenus) {
      if (m.id === currentTab) return true;
      if (m.submenus.some(s => s.id === currentTab)) return true;
    }
    return false;
  };

  // Dynamic Content Router matching the consolidated single-submenu per menu model
  const renderContent = () => {
    if (currentRole === 'Staff' && !isTabPermitted()) {
      return (
        <div className="p-8 text-center text-slate-600 max-w-lg mx-auto space-y-4 bg-white border border-slate-200 rounded-2xl shadow-xs mt-12">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl font-bold">
            🔒
          </div>
          <h3 className="text-lg font-bold text-slate-900">Module Access Restricted</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Your assigned role (<strong className="text-slate-800">{activeStaffUser?.assigned_roles?.[0] || 'Staff'}</strong>) does not have access permissions for this screen.
          </p>
          <button
            onClick={() => {
              const permitted = resolveEffectiveMenus('Staff', activeStaffUser?.assigned_roles || ['Finance Head / Controller'], roles);
              if (permitted.length > 0 && permitted[0].submenus.length > 0) {
                setCurrentTab(permitted[0].submenus[0].id);
              } else {
                setCurrentTab('dashboard');
              }
            }}
            className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs transition"
          >
            Return to Authorized Dashboard
          </button>
        </div>
      );
    }

    // 1. PARENT PORTAL
    if (currentRole === 'Parent' || currentTab.startsWith('parent_')) {
      return (
        <ParentPortalView 
          students={MOCK_STUDENTS}
          invoices={invoices}
          payments={payments}
          currentTab={currentTab}
          onMakePayment={handleMakePayment}
        />
      );
    }

    // 2. SUPERADMIN PORTAL
    if (currentRole === 'Superadmin' || currentTab.startsWith('sa_')) {
      return (
        <SuperadminView 
          companies={companies}
          onAddCompany={(c) => { setCompanies([...companies, c]); handleAuditLog('CREATE', 'Organisation Management', `Created entity ${c.display_name}`); }}
          branches={branches}
          onAddBranch={(b) => { setBranches([...branches, b]); handleAuditLog('CREATE', 'Branch Management', `Created campus ${b.branch_name}`); }}
          initialTab={currentTab}
        />
      );
    }

    // 3. DASHBOARD
    if (currentTab === 'dashboard') {
      return (
        <Dashboard 
          selectedCompany={selectedCompany}
          selectedBranch={selectedBranch}
          selectedFy={selectedFy}
          vouchers={vouchers}
          invoices={invoices}
          onNavigate={(tab) => setCurrentTab(tab)}
          currentRole={currentRole}
          staffModules={activeStaffUser?.assigned_roles || ['Finance Head / Controller']}
          activeStaffUser={activeStaffUser}
        />
      );
    }

    // 4. ORGANISATION & BRANCH
    if (currentTab === 'organisation_branch' || currentTab.startsWith('org_')) {
      return (
        <OrganisationView 
          companies={companies}
          branches={branches}
          users={users}
        />
      );
    }

    // 5. STAFF MANAGEMENT
    if (currentTab === 'staff_management' || currentTab.startsWith('sm_')) {
      return (
        <StaffManagementView 
          users={users}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onSwitchToStaffRole={handleSwitchToStaffProfile}
          branches={branches}
          roles={roles}
        />
      );
    }

    // 6. ROLE & PERMISSION MANAGEMENT
    if (currentTab === 'role_management' || currentTab === 'permission_management' || currentTab.startsWith('role_')) {
      return (
        <RolePermissionManagementView 
          roles={roles}
          onAddRole={handleAddRole}
          onUpdateRole={handleUpdateRole}
          users={users}
          branches={branches}
          currentRole={currentRole}
          initialTab={currentTab === 'permission_management' ? 'matrix' : 'templates'}
          onAuditLog={handleAuditLog}
        />
      );
    }

    // 7. PAYROLL & ATTENDANCE (Attendance directly after Employees in Payroll hub!)
    if (currentTab === 'payroll' || currentTab.startsWith('pay_')) {
      return (
        <PayrollView 
          employees={MOCK_EMPLOYEES}
          payrollRuns={MOCK_PAYROLL_RUNS}
          attendanceRecords={attendanceRecords}
          onAddAttendance={handleAddAttendance}
          onUpdateAttendance={handleUpdateAttendance}
          onBulkAddAttendance={handleBulkAddAttendance}
          branches={branches}
          currentRole={currentRole}
          initialTab={currentTab === 'pay_attendance' ? 'attendance' : 'employees'}
        />
      );
    }

    // 8. ACCOUNTING SETUP
    if (currentTab === 'accounting_setup' || currentTab.startsWith('acc_')) {
      return (
        <AccountingView 
          accountGroups={MOCK_ACCOUNT_GROUPS}
          ledgers={MOCK_LEDGERS}
          costCentres={MOCK_COST_CENTRES}
          vouchers={vouchers}
          onAddVoucher={(v) => {
            setVouchers([v, ...vouchers]);
            handleAuditLog('POST', 'Accounting Vouchers', `Posted voucher ${v.voucher_number} for ₹${v.total_debit.toLocaleString('en-IN')}`);
          }}
          initialTab="vouchers"
        />
      );
    }

    // 9. STUDENT FINANCE
    if (currentTab === 'student_finance' || currentTab.startsWith('sf_')) {
      return (
        <StudentFinanceView 
          students={MOCK_STUDENTS}
          guardians={MOCK_GUARDIANS}
          feePlans={MOCK_FEE_PLANS}
          invoices={invoices}
          payments={payments}
          initialTab="invoices"
        />
      );
    }

    // 10. BANKING
    if (currentTab === 'banking' || currentTab.startsWith('bnk_')) {
      return (
        <BankingView 
          bankAccounts={MOCK_BANK_ACCOUNTS}
          gateways={MOCK_GATEWAYS}
          statements={MOCK_STATEMENTS}
          vouchers={vouchers}
          initialTab="reconciliation"
        />
      );
    }

    // 11. PROCUREMENT
    if (currentTab === 'procurement' || currentTab.startsWith('prc_')) {
      return (
        <ProcurementView 
          vendors={MOCK_VENDORS}
          vendorBills={MOCK_VENDOR_BILLS}
        />
      );
    }

    // 12. TAX & COMPLIANCE
    if (currentTab === 'tax_compliance' || currentTab.startsWith('tax_')) {
      return <AdminOperationsView moduleType="tax" branches={branches} currentRole={currentRole} />;
    }

    // 13. BUDGETS & FUNDS
    if (currentTab === 'budgets_funds' || currentTab.startsWith('bud_')) {
      return <AdminOperationsView moduleType="budgets" branches={branches} currentRole={currentRole} />;
    }

    // 14. INVENTORY & ASSETS
    if (currentTab === 'inventory_assets' || currentTab.startsWith('inv_')) {
      return <AdminOperationsView moduleType="inventory" branches={branches} currentRole={currentRole} />;
    }

    // 15. REPORTS
    if (currentTab === 'reports' || currentTab.startsWith('rep_')) {
      return <ReportsView />;
    }

    // 16. APPROVALS & AUDIT LOGS
    if (currentTab === 'approvals' || currentTab === 'audit_logs' || currentTab.startsWith('appr_')) {
      return <ApprovalsView auditLogs={auditLogs} initialTab={currentTab === 'audit_logs' ? 'audit' : 'pending'} />;
    }

    // 17. ADMINISTRATION
    if (currentTab === 'administration' || currentTab.startsWith('adm_')) {
      return <AdminOperationsView moduleType="administration" branches={branches} currentRole={currentRole} />;
    }

    // Default Fallback
    return (
      <Dashboard 
        selectedCompany={selectedCompany}
        selectedBranch={selectedBranch}
        selectedFy={selectedFy}
        vouchers={vouchers}
        invoices={invoices}
        onNavigate={(tab) => setCurrentTab(tab)}
        currentRole={currentRole}
        staffModules={activeStaffUser?.assigned_roles || ['Finance Head / Controller']}
        activeStaffUser={activeStaffUser}
      />
    );
  };

  if (!isLoggedIn) {
    return (
      <LoginView 
        onLogin={(role, staffUser) => {
          handleRoleChange(role);
          if (staffUser) setActiveStaffUser(staffUser);
          setIsLoggedIn(true);
        }}
        staffUsers={users}
      />
    );
  }

  return (
    <div className="h-screen bg-[#FAF7F3] text-slate-900 flex flex-col overflow-hidden font-sans selection:bg-[#8B3552] selection:text-white">
      {/* Top Header */}
      <Header 
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        portalType={portalType}
        onPortalTypeToggle={setPortalType}
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        branches={branches}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        financialYears={MOCK_FINANCIAL_YEARS}
        selectedFy={selectedFy}
        onFyChange={setSelectedFy}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        activeStaffUser={activeStaffUser}
        staffUsers={users}
        onSelectStaffUser={handleSwitchToStaffProfile}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Dynamic Navigation Sidebar */}
        <Sidebar 
          portalType={portalType}
          currentRole={currentRole}
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          activeStaffUser={activeStaffUser}
          staffUsers={users}
          onSelectStaffUser={handleSwitchToStaffProfile}
          roles={roles}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Content Surface */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#FAF7F3] pb-12">
          <Breadcrumbs currentRole={currentRole} currentTab={currentTab} />
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
