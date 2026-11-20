import { 
  MenuItem, 
  RoleDefinition, 
  StaffRoleTemplate, 
  ActionPermission, 
  DataScope 
} from '../types';

// ALL ACTIONS DEFINITION
export const ALL_ACTION_PERMISSIONS: { id: ActionPermission; label: string; description: string }[] = [
  { id: 'view', label: 'View', description: 'Read and view records on this page' },
  { id: 'create', label: 'Create', description: 'Create new entries and drafts' },
  { id: 'edit', label: 'Edit', description: 'Modify and update existing records' },
  { id: 'delete', label: 'Delete', description: 'Soft-delete or permanently remove records' },
  { id: 'submit', label: 'Submit', description: 'Submit entries for maker-checker review' },
  { id: 'approve_reject', label: 'Approve / Reject', description: 'Sign off, approve, or reject submissions' },
  { id: 'pay_process', label: 'Pay / Process', description: 'Execute disbursements, payroll, and refunds' },
  { id: 'import', label: 'Import', description: 'Upload and bulk ingest records (CSV/Excel)' },
  { id: 'export', label: 'Export', description: 'Export tabular data to CSV or Excel' },
  { id: 'print_download', label: 'Print / Download', description: 'Generate and print official PDF summaries' }
];

// SUPER ADMIN MENUS (EXACTLY ONE SUBMENU PER MAIN MENU)
export const SUPER_ADMIN_MENUS: MenuItem[] = [
  {
    id: 'sa_dashboard_menu',
    title: 'Dashboard',
    iconName: 'LayoutDashboard',
    submenus: [
      { id: 'sa_dashboard', title: 'Platform Overview & Metrics', actions: ['view', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'sa_branch_mgmt_menu',
    title: 'Branch Management',
    iconName: 'MapPin',
    submenus: [
      { id: 'sa_branch_mgmt', title: 'Branch & Admin Hub', actions: ['view', 'create', 'edit', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'sa_subscription_mgmt_menu',
    title: 'Subscription Management',
    iconName: 'CreditCard',
    submenus: [
      { id: 'sa_subscription_mgmt', title: 'Subscriptions & Billing', actions: ['view', 'create', 'edit', 'pay_process', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'sa_platform_users_menu',
    title: 'Platform Users',
    iconName: 'Users',
    submenus: [
      { id: 'sa_platform_users', title: 'Users & Lock Status', actions: ['view', 'edit', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'sa_reports_analytics_menu',
    title: 'Reports & Analytics',
    iconName: 'BarChart3',
    submenus: [
      { id: 'sa_reports_analytics', title: 'Tenant & Usage Reports', actions: ['view', 'export', 'print_download'], scope: 'all' }
    ]
  },
  {
    id: 'sa_audit_logs_menu',
    title: 'Audit Logs',
    iconName: 'History',
    submenus: [
      { id: 'sa_audit_logs', title: 'Platform Activity Logs', actions: ['view', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'sa_platform_settings_menu',
    title: 'Platform Settings',
    iconName: 'Settings',
    submenus: [
      { id: 'sa_platform_settings', title: 'General & Security Settings', actions: ['view', 'edit'], scope: 'all' }
    ]
  }
];

// MASTER ADMIN / CENTRAL STAFF PERMISSION CATALOGUE MENUS
export const MASTER_ADMIN_MENUS: MenuItem[] = [
  {
    id: 'dashboard_menu',
    title: 'Dashboard',
    iconName: 'LayoutDashboard',
    submenus: [
      { id: 'dashboard', title: 'Branch Command Center', actions: ['view', 'export', 'approve_reject'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'organisation_branch_menu',
    title: 'Organisation & Branch',
    iconName: 'Building',
    submenus: [
      { id: 'org_companies', title: 'Legal Companies', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'org_branches', title: 'Campuses & Branches', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'org_fy', title: 'Financial Year & Closing', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'org_gst', title: 'GST Registrations', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'org_users', title: 'Campus Administrators', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'staff_management_menu',
    title: 'Staff Management',
    iconName: 'Users',
    submenus: [
      { id: 'sm_staff', title: 'Staff Directory', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'sm_roles', title: 'Role Templates & Custom Roles', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'sm_matrix', title: 'Permission Catalogue Matrix', actions: ['view', 'export'], scope: 'assigned_branches' },
      { id: 'sm_overrides', title: 'User-Specific Overrides', actions: ['view', 'create', 'edit', 'delete'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'role_management_menu',
    title: 'Role Management',
    iconName: 'Shield',
    submenus: [
      { id: 'role_templates', title: 'Default Roles & Templates', actions: ['view', 'create', 'edit', 'export'], scope: 'all' }
    ]
  },
  {
    id: 'permission_management_menu',
    title: 'Permission Management',
    iconName: 'KeyRound',
    submenus: [
      { id: 'perm_matrix', title: 'Granular Permission Matrix', actions: ['view', 'edit', 'export'], scope: 'all' },
      { id: 'perm_overrides', title: 'User-Specific Overrides', actions: ['view', 'create', 'edit', 'delete'], scope: 'all' }
    ]
  },
  {
    id: 'accounting_setup_menu',
    title: 'Accounting Setup',
    iconName: 'BookOpen',
    submenus: [
      { id: 'acc_vouchers', title: 'Day Book & Vouchers', actions: ['view', 'create', 'edit', 'submit', 'approve_reject', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'acc_ledgers', title: 'Chart of Ledgers', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'acc_groups', title: 'Account Groups', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'acc_cost_centres', title: 'Cost Centres', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'student_finance_menu',
    title: 'Student Finance',
    iconName: 'GraduationCap',
    submenus: [
      { id: 'sf_invoices', title: 'Fee Invoices', actions: ['view', 'create', 'edit', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'sf_students', title: 'Students & Guardians', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'sf_payments', title: 'Collections & Receipts', actions: ['view', 'create', 'edit', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'sf_plans', title: 'Fee Plans & Heads', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'sf_refunds', title: 'Concessions & Refunds', actions: ['view', 'create', 'approve_reject', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'banking_menu',
    title: 'Banking',
    iconName: 'Landmark',
    submenus: [
      { id: 'bnk_reconciliation', title: 'Bank Reconciliation', actions: ['view', 'create', 'edit', 'import', 'export'], scope: 'assigned_bank_accounts' },
      { id: 'bnk_book', title: 'Bank Book Ledger', actions: ['view', 'export', 'print_download'], scope: 'assigned_bank_accounts' },
      { id: 'bnk_accounts', title: 'Bank Accounts', actions: ['view', 'create', 'edit'], scope: 'assigned_bank_accounts' },
      { id: 'bnk_gateways', title: 'Payment Gateways', actions: ['view', 'edit', 'export'], scope: 'assigned_bank_accounts' }
    ]
  },
  {
    id: 'procurement_menu',
    title: 'Procurement',
    iconName: 'ShoppingBag',
    submenus: [
      { id: 'prc_bills', title: 'Vendor Bills & Payables', actions: ['view', 'create', 'edit', 'submit', 'approve_reject', 'export'], scope: 'assigned_branches' },
      { id: 'prc_pos', title: 'Purchase Requests & Orders', actions: ['view', 'create', 'edit', 'submit', 'approve_reject', 'print_download'], scope: 'assigned_branches' },
      { id: 'prc_payments', title: 'Disbursements & Payments', actions: ['view', 'create', 'pay_process', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'prc_vendors', title: 'Vendor Directory', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'payroll_menu',
    title: 'Payroll',
    iconName: 'Wallet',
    submenus: [
      { id: 'pay_employees', title: 'Employees', actions: ['view', 'create', 'edit', 'export'], scope: 'assigned_branches' },
      { id: 'pay_attendance', title: 'Daily Attendance', actions: ['view', 'create', 'edit', 'import', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'pay_attendance_register', title: 'Monthly Attendance Register', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'pay_runs', title: 'Payroll Runs', actions: ['view', 'create', 'submit', 'approve_reject', 'pay_process', 'export'], scope: 'assigned_branches' },
      { id: 'pay_structures', title: 'Salary Structures', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'pay_payslips', title: 'Payslips', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'tax_compliance_menu',
    title: 'Tax & Compliance',
    iconName: 'FileCheck',
    submenus: [
      { id: 'tax_rules', title: 'Tax Rules & Rates', actions: ['view', 'create', 'edit'], scope: 'assigned_branches' },
      { id: 'tax_gst', title: 'GST Transactions', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'tax_tds', title: 'TDS Deductions', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'tax_challans', title: 'Tax Challans (ITNS 281)', actions: ['view', 'pay_process', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'budgets_funds_menu',
    title: 'Budgets & Funds',
    iconName: 'Coins',
    submenus: [
      { id: 'budgets_funds', title: 'Budgets & Endowment Funds', actions: ['view', 'create', 'edit', 'approve_reject', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'inventory_assets_menu',
    title: 'Inventory & Assets',
    iconName: 'Package',
    submenus: [
      { id: 'inventory_assets', title: 'Inventory & Fixed Assets', actions: ['view', 'create', 'edit', 'export', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'reports_menu',
    title: 'Reports',
    iconName: 'BarChart3',
    submenus: [
      { id: 'rep_trial_balance', title: 'Trial Balance', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'rep_income_exp', title: 'Income & Expenditure', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'rep_balance_sheet', title: 'Balance Sheet', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'rep_day_book', title: 'Day Book & Ledger Extract', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' },
      { id: 'rep_outstanding', title: 'Outstanding Dues & Aging', actions: ['view', 'export', 'print_download'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'approvals_menu',
    title: 'Approvals',
    iconName: 'CheckSquare',
    submenus: [
      { id: 'approvals', title: 'Maker-Checker Approvals', actions: ['view', 'approve_reject'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'audit_logs_menu',
    title: 'Audit Logs',
    iconName: 'History',
    submenus: [
      { id: 'audit_logs', title: 'Security & Transaction Logs', actions: ['view', 'export'], scope: 'assigned_branches' }
    ]
  },
  {
    id: 'administration_menu',
    title: 'Administration',
    iconName: 'Sliders',
    submenus: [
      { id: 'administration', title: 'Campus Settings & Notifications', actions: ['view', 'edit'], scope: 'assigned_branches' }
    ]
  }
];

// PARENT PORTAL MENUS (EXACTLY ONE SUBMENU PER MAIN MENU)
export const PARENT_MENUS: MenuItem[] = [
  {
    id: 'parent_home_menu',
    title: 'Home',
    iconName: 'Home',
    submenus: [
      { id: 'parent_home', title: 'Dashboard & Summary', actions: ['view', 'print_download'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_children_menu',
    title: 'My Children',
    iconName: 'GraduationCap',
    submenus: [
      { id: 'parent_children', title: 'Children Profiles', actions: ['view'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_fee_details_menu',
    title: 'Fee Details',
    iconName: 'FileText',
    submenus: [
      { id: 'parent_fee_details', title: 'Fee Invoices & Breakdown', actions: ['view', 'print_download'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_pay_fees_menu',
    title: 'Pay Fees',
    iconName: 'CreditCard',
    submenus: [
      { id: 'parent_pay_fees', title: 'Online Payment Gateway', actions: ['view', 'pay_process'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_payment_history_menu',
    title: 'Payment History',
    iconName: 'History',
    submenus: [
      { id: 'parent_payment_history', title: 'Transaction History', actions: ['view', 'export', 'print_download'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_receipts_menu',
    title: 'Receipts',
    iconName: 'Receipt',
    submenus: [
      { id: 'parent_receipts', title: 'Digital Fee Receipts', actions: ['view', 'export', 'print_download'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_profile_menu',
    title: 'Profile',
    iconName: 'User',
    submenus: [
      { id: 'parent_profile', title: 'Guardian Contact Profile', actions: ['view', 'edit'], scope: 'linked_children' }
    ]
  },
  {
    id: 'parent_help_menu',
    title: 'Help / Requests',
    iconName: 'HelpCircle',
    submenus: [
      { id: 'parent_help', title: 'Help & Fee Inquiries', actions: ['view', 'create'], scope: 'linked_children' }
    ]
  }
];

// 8 DEFAULT STAFF ROLE TEMPLATES MAPPED TO SECTION SUBMENU IDS
export const DEFAULT_STAFF_ROLE_TEMPLATES: RoleDefinition[] = [
  {
    roleId: 'role-fin-head',
    roleName: 'Finance Head / Controller',
    isDefaultTemplate: true,
    description: 'Provide broad finance access within assigned branches: Accounting, Student Finance, Banking, Procurement, Payroll & Attendance, Tax, Budgets, Reports, Approvals, and Audit History.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'accounting_setup_menu',
        submenuIds: ['acc_vouchers', 'acc_ledgers', 'acc_groups', 'acc_cost_centres'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'student_finance_menu',
        submenuIds: ['sf_invoices', 'sf_students', 'sf_payments', 'sf_plans', 'sf_refunds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'banking_menu',
        submenuIds: ['bnk_reconciliation', 'bnk_book', 'bnk_accounts', 'bnk_gateways'],
        scope: 'assigned_bank_accounts'
      },
      {
        menuId: 'procurement_menu',
        submenuIds: ['prc_bills', 'prc_pos', 'prc_payments', 'prc_vendors'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'payroll_menu',
        submenuIds: ['pay_employees', 'pay_attendance', 'pay_attendance_register', 'pay_runs', 'pay_structures', 'pay_payslips'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'tax_compliance_menu',
        submenuIds: ['tax_rules', 'tax_gst', 'tax_tds', 'tax_challans'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'budgets_funds_menu',
        submenuIds: ['budgets_funds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_trial_balance', 'rep_income_exp', 'rep_balance_sheet', 'rep_day_book', 'rep_outstanding'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'approvals_menu',
        submenuIds: ['approvals'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'audit_logs_menu',
        submenuIds: ['audit_logs'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-accountant',
    roleName: 'Accountant',
    isDefaultTemplate: true,
    description: 'Day-to-day general ledger postings, vouchers, reconciliation, vendor bills, tax transactions, and basic budget line monitoring.',
    assignedStaffCount: 3,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'accounting_setup_menu',
        submenuIds: ['acc_vouchers', 'acc_ledgers', 'acc_groups', 'acc_cost_centres'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'student_finance_menu',
        submenuIds: ['sf_invoices', 'sf_students', 'sf_payments', 'sf_plans', 'sf_refunds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'banking_menu',
        submenuIds: ['bnk_reconciliation', 'bnk_book', 'bnk_accounts', 'bnk_gateways'],
        scope: 'assigned_bank_accounts'
      },
      {
        menuId: 'procurement_menu',
        submenuIds: ['prc_bills', 'prc_pos', 'prc_payments', 'prc_vendors'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'tax_compliance_menu',
        submenuIds: ['tax_rules', 'tax_gst', 'tax_tds', 'tax_challans'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_trial_balance', 'rep_income_exp', 'rep_balance_sheet', 'rep_day_book', 'rep_outstanding'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'audit_logs_menu',
        submenuIds: ['audit_logs'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-branch-cashier',
    roleName: 'Branch Finance / Cashier Officer',
    isDefaultTemplate: true,
    description: 'Cash counter fee collections, student fee search, daily deposit slips, and refund requests (refund request submission only, no approval).',
    assignedStaffCount: 4,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'student_finance_menu',
        submenuIds: ['sf_invoices', 'sf_students', 'sf_payments', 'sf_refunds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'banking_menu',
        submenuIds: ['bnk_reconciliation', 'bnk_book', 'bnk_accounts'],
        scope: 'assigned_bank_accounts'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_day_book', 'rep_outstanding'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-fee-admin',
    roleName: 'Student Fee Administrator',
    isDefaultTemplate: true,
    description: 'Configures annual/term fee plans, fee heads, concession schemes, invoice batch generation, and collection reports.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'student_finance_menu',
        submenuIds: ['sf_invoices', 'sf_students', 'sf_payments', 'sf_plans', 'sf_refunds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_day_book', 'rep_outstanding'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-payroll-hr',
    roleName: 'Payroll & HR Officer',
    isDefaultTemplate: true,
    description: 'Manages employee records, Daily Attendance & Attendance Register, salary structures, payroll runs, payslips, and salary expense vouchers.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'payroll_menu',
        submenuIds: ['pay_employees', 'pay_attendance', 'pay_attendance_register', 'pay_runs', 'pay_structures', 'pay_payslips'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'accounting_setup_menu',
        submenuIds: ['acc_vouchers', 'acc_ledgers'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'tax_compliance_menu',
        submenuIds: ['tax_tds', 'tax_challans'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_day_book', 'rep_trial_balance'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-procurement-coord',
    roleName: 'Procurement & Budget Coordinator',
    isDefaultTemplate: true,
    description: 'Coordinates vendor quotations, purchase requests, purchase orders, budget lines, warehouses, and fixed assets inventory.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'procurement_menu',
        submenuIds: ['prc_bills', 'prc_pos', 'prc_payments', 'prc_vendors'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'budgets_funds_menu',
        submenuIds: ['budgets_funds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'inventory_assets_menu',
        submenuIds: ['inventory_assets'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'accounting_setup_menu',
        submenuIds: ['acc_vouchers', 'acc_cost_centres'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_trial_balance', 'rep_outstanding'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-leadership',
    roleName: 'School Leadership / Governance',
    isDefaultTemplate: true,
    description: 'School principal, trustees, and management board. High-level financial overviews, executive reports, budget reviews, and milestone sign-offs.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_trial_balance', 'rep_income_exp', 'rep_balance_sheet', 'rep_day_book', 'rep_outstanding'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'budgets_funds_menu',
        submenuIds: ['budgets_funds'],
        scope: 'assigned_branches'
      },
      {
        menuId: 'approvals_menu',
        submenuIds: ['approvals'],
        scope: 'assigned_branches'
      }
    ]
  },
  {
    roleId: 'role-auditor',
    roleName: 'Internal / External Auditor',
    isDefaultTemplate: true,
    description: 'Read-only financial audit and compliance inspection: Journals, Attendance, Payroll runs, Bank books, Tax challans, and Security logs.',
    assignedStaffCount: 2,
    allowedMenus: [
      {
        menuId: 'dashboard_menu',
        submenuIds: ['dashboard'],
        scope: 'authorised_records'
      },
      {
        menuId: 'accounting_setup_menu',
        submenuIds: ['acc_vouchers', 'acc_ledgers', 'acc_groups', 'acc_cost_centres'],
        scope: 'authorised_records'
      },
      {
        menuId: 'student_finance_menu',
        submenuIds: ['sf_invoices', 'sf_students', 'sf_payments', 'sf_plans', 'sf_refunds'],
        scope: 'authorised_records'
      },
      {
        menuId: 'banking_menu',
        submenuIds: ['bnk_reconciliation', 'bnk_book', 'bnk_accounts', 'bnk_gateways'],
        scope: 'authorised_records'
      },
      {
        menuId: 'procurement_menu',
        submenuIds: ['prc_bills', 'prc_pos', 'prc_payments', 'prc_vendors'],
        scope: 'authorised_records'
      },
      {
        menuId: 'payroll_menu',
        submenuIds: ['pay_employees', 'pay_attendance', 'pay_attendance_register', 'pay_runs', 'pay_structures', 'pay_payslips'],
        scope: 'authorised_records'
      },
      {
        menuId: 'tax_compliance_menu',
        submenuIds: ['tax_rules', 'tax_gst', 'tax_tds', 'tax_challans'],
        scope: 'authorised_records'
      },
      {
        menuId: 'budgets_funds_menu',
        submenuIds: ['budgets_funds'],
        scope: 'authorised_records'
      },
      {
        menuId: 'inventory_assets_menu',
        submenuIds: ['inventory_assets'],
        scope: 'authorised_records'
      },
      {
        menuId: 'reports_menu',
        submenuIds: ['rep_trial_balance', 'rep_income_exp', 'rep_balance_sheet', 'rep_day_book', 'rep_outstanding'],
        scope: 'authorised_records'
      },
      {
        menuId: 'audit_logs_menu',
        submenuIds: ['audit_logs'],
        scope: 'authorised_records'
      }
    ]
  }
];

/**
 * Resolves the effective menus and submenus visible to a user based on their role and assigned templates
 */
export function resolveEffectiveMenus(
  accountType: 'Super Admin' | 'Admin' | 'Staff' | 'Parent',
  assignedRoles: string[] = [],
  customRoles: RoleDefinition[] = [],
  userOverrides?: { deniedSubmenus?: string[]; grantedSubmenus?: string[] }
): MenuItem[] {
  if (accountType === 'Super Admin') {
    return SUPER_ADMIN_MENUS;
  }

  if (accountType === 'Admin') {
    return MASTER_ADMIN_MENUS;
  }

  if (accountType === 'Parent') {
    return PARENT_MENUS;
  }

  // For Staff: Union permissions across all assigned roles
  const allAvailableRoles = [...DEFAULT_STAFF_ROLE_TEMPLATES, ...customRoles];
  const activeRoleDefs = allAvailableRoles.filter(r => 
    assignedRoles.includes(r.roleName) || assignedRoles.includes(r.roleId)
  );

  // If no roles assigned, return empty list
  if (activeRoleDefs.length === 0) {
    return [];
  }

  const allowedSubmenuIds = new Set<string>();
  activeRoleDefs.forEach(role => {
    role.allowedMenus.forEach(m => {
      m.submenuIds.forEach(subId => allowedSubmenuIds.add(subId));
    });
  });

  // Apply user overrides
  if (userOverrides?.grantedSubmenus) {
    userOverrides.grantedSubmenus.forEach(s => allowedSubmenuIds.add(s));
  }
  if (userOverrides?.deniedSubmenus) {
    userOverrides.deniedSubmenus.forEach(s => allowedSubmenuIds.delete(s));
  }

  // Filter master menus: keep menu only if it has at least one visible submenu
  const filteredMenus: MenuItem[] = [];

  MASTER_ADMIN_MENUS.forEach(menu => {
    const visibleSubmenus = menu.submenus.filter(sub => allowedSubmenuIds.has(sub.id));
    if (visibleSubmenus.length > 0) {
      filteredMenus.push({
        ...menu,
        submenus: visibleSubmenus
      });
    }
  });

  return filteredMenus;
}

/**
 * Checks if a specific action on a submenu is permitted for a staff user
 */
export function isActionPermitted(
  accountType: 'Super Admin' | 'Admin' | 'Staff' | 'Parent',
  submenuId: string,
  action: ActionPermission,
  assignedRoles: string[] = [],
  customRoles: RoleDefinition[] = [],
  userOverrides?: { actionsOverrides?: Record<string, ActionPermission[]> }
): boolean {
  if (accountType === 'Super Admin' || accountType === 'Admin') {
    return true;
  }

  if (accountType === 'Parent') {
    for (const m of PARENT_MENUS) {
      const sub = m.submenus.find(s => s.id === submenuId);
      if (sub) {
        return sub.actions.includes(action);
      }
    }
    return false;
  }

  // Staff check
  if (userOverrides?.actionsOverrides?.[submenuId]) {
    return userOverrides.actionsOverrides[submenuId].includes(action);
  }

  const allAvailableRoles = [...DEFAULT_STAFF_ROLE_TEMPLATES, ...customRoles];
  const activeRoleDefs = allAvailableRoles.filter(r => 
    assignedRoles.includes(r.roleName) || assignedRoles.includes(r.roleId)
  );

  for (const role of activeRoleDefs) {
    for (const m of role.allowedMenus) {
      if (m.submenuIds.includes(submenuId)) {
        return true;
      }
    }
  }

  return false;
}
