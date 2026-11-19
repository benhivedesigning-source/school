import {
  Company,
  Branch,
  FinancialYear,
  UserProfile,
  AccountGroup,
  Ledger,
  CostCentre,
  AccountingVoucher,
  Student,
  Guardian,
  StudentGuardian,
  FeeHead,
  FeePlan,
  FeeInvoice,
  FeePayment,
  BankAccount,
  PaymentGateway,
  BankStatement,
  BankReconciliation,
  Vendor,
  VendorBill,
  Employee,
  PayrollRun,
  AuditLog,
  AttendanceRecord,
  PlatformSubscription,
  PlatformUser,
  BudgetRecord,
  FixedAssetRecord,
  TaxRule,
  RoleDefinition
} from './types';

export const MOCK_COMPANIES: Company[] = [
  {
    company_id: 'comp-001',
    organisation_id: 'org-001',
    company_code: 'GVET-MAIN',
    legal_name: 'Green Valley Education Trust',
    display_name: 'Green Valley School - Main Campus',
    entity_type: 'Trust',
    base_currency: 'INR',
    books_beginning_date: '2026-04-01',
    company_status: 'Active'
  },
  {
    company_id: 'comp-002',
    organisation_id: 'org-001',
    company_code: 'GVET-SPORTS',
    legal_name: 'Green Valley Sports & Academy Foundation',
    display_name: 'Green Valley Sports Complex',
    entity_type: 'Trust',
    base_currency: 'INR',
    books_beginning_date: '2026-04-01',
    company_status: 'Active'
  }
];

export const MOCK_BRANCHES: Branch[] = [
  {
    branch_id: 'branch-01',
    company_id: 'comp-001',
    branch_code: 'CHN-01',
    branch_name: 'Chennai Main Campus',
    branch_type: 'Head Office',
    is_head_office: true,
    branch_status: 'Active',
    branch_admin_name: 'Kavitha Ranganathan',
    branch_admin_email: 'kavitha@greenvalley.edu',
    branch_admin_phone: '+91 98400 11001'
  },
  {
    branch_id: 'branch-02',
    company_id: 'comp-001',
    branch_code: 'CBE-02',
    branch_name: 'Coimbatore Campus',
    branch_type: 'Campus',
    is_head_office: false,
    branch_status: 'Active',
    branch_admin_name: 'R. Balasubramanian',
    branch_admin_email: 'bala.cbe@greenvalley.edu',
    branch_admin_phone: '+91 98400 22002'
  },
  {
    branch_id: 'branch-03',
    company_id: 'comp-002',
    branch_code: 'BLR-03',
    branch_name: 'Bengaluru Sports Hub',
    branch_type: 'Campus',
    is_head_office: false,
    branch_status: 'Active',
    branch_admin_name: 'Sunil Rao',
    branch_admin_email: 'sunil.blr@greenvalley.edu',
    branch_admin_phone: '+91 98400 33003'
  }
];

export const MOCK_FINANCIAL_YEARS: FinancialYear[] = [
  {
    financial_year_id: 'fy-2026-27',
    year_name: 'FY 2026-2027',
    start_date: '2026-04-01',
    end_date: '2027-03-31',
    period_status: 'Open'
  },
  {
    financial_year_id: 'fy-2025-26',
    year_name: 'FY 2025-2026',
    start_date: '2025-04-01',
    end_date: '2026-03-31',
    period_status: 'Locked'
  }
];

// USER PROFILES INCLUDING THE 8 ROLE TEMPLATES
export const MOCK_USERS: UserProfile[] = [
  {
    user_id: 'usr-superadmin',
    full_name: 'Dr. Subramanian Iyer',
    email: 'superadmin@greenvalley.edu',
    phone_number: '+91 98400 11223',
    role_id: 'Superadmin',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02', 'branch-03'],
    title: 'Platform Super Administrator',
    department: 'Platform Governance',
    designation: 'Managing Trustee & Chief Patron',
    employee_id: 'EMP-SA-01',
    user_status: 'Active'
  },
  {
    user_id: 'usr-admin',
    full_name: 'Kavitha Ranganathan',
    email: 'admin@greenvalley.edu',
    phone_number: '+91 98400 33445',
    role_id: 'Admin',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02'],
    title: 'School Chief Finance Administrator',
    department: 'Finance & Accounts',
    designation: 'Finance Controller',
    employee_id: 'EMP-ADM-02',
    user_status: 'Active'
  },
  // Staff User 1: Finance Head / Controller
  {
    user_id: 'usr-staff-1',
    full_name: 'Ramesh Narayan',
    email: 'ramesh.narayan@greenvalley.edu',
    phone_number: '+91 98400 44551',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02'],
    title: 'Finance Head & Controller',
    department: 'Finance',
    designation: 'Finance Head',
    employee_id: 'EMP-FH-101',
    assigned_roles: ['Finance Head / Controller'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 2: Accountant
  {
    user_id: 'usr-staff-2',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@greenvalley.edu',
    phone_number: '+91 98400 44552',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01'],
    title: 'Senior General Accountant',
    department: 'Accounts',
    designation: 'Senior Accountant',
    employee_id: 'EMP-ACC-102',
    assigned_roles: ['Accountant'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 3: Branch Finance / Cashier Officer
  {
    user_id: 'usr-staff-3',
    full_name: 'Suresh Kumar',
    email: 'suresh.kumar@greenvalley.edu',
    phone_number: '+91 98400 44553',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01'],
    title: 'Branch Cashier & Fee Collector',
    department: 'Treasury & Cash',
    designation: 'Cashier Officer',
    employee_id: 'EMP-CSH-103',
    assigned_roles: ['Branch Finance / Cashier Officer'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 4: Student Fee Administrator
  {
    user_id: 'usr-staff-4',
    full_name: 'Deepa Sundaram',
    email: 'deepa.sundaram@greenvalley.edu',
    phone_number: '+91 98400 44554',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02'],
    title: 'Student Fee Operations Lead',
    department: 'Student Billing',
    designation: 'Fee Administrator',
    employee_id: 'EMP-SFA-104',
    assigned_roles: ['Student Fee Administrator'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 5: Payroll & HR Officer
  {
    user_id: 'usr-staff-5',
    full_name: 'Anant Varma',
    email: 'anant.varma@greenvalley.edu',
    phone_number: '+91 98400 44555',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01'],
    title: 'Payroll & HR Specialist',
    department: 'Human Resources',
    designation: 'HR & Payroll Lead',
    employee_id: 'EMP-PAY-105',
    assigned_roles: ['Payroll & HR Officer'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 6: Procurement & Budget Coordinator
  {
    user_id: 'usr-staff-6',
    full_name: 'Vijayalakshmi Iyer',
    email: 'viji.iyer@greenvalley.edu',
    phone_number: '+91 98400 44556',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02'],
    title: 'Procurement & Asset Coordinator',
    department: 'Procurement & Inventory',
    designation: 'Procurement Manager',
    employee_id: 'EMP-PRC-106',
    assigned_roles: ['Procurement & Budget Coordinator'],
    assigned_branch_name: 'Chennai Main Campus',
    user_status: 'Active'
  },
  // Staff User 7: School Leadership / Governance
  {
    user_id: 'usr-staff-7',
    full_name: 'Dr. K. Venkataraman',
    email: 'trustee.venkat@greenvalley.edu',
    phone_number: '+91 98400 44557',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02', 'branch-03'],
    title: 'Executive School Trustee & Governor',
    department: 'Board of Governors',
    designation: 'School Leadership',
    employee_id: 'EMP-GOV-107',
    assigned_roles: ['School Leadership / Governance'],
    assigned_branch_name: 'All Campuses',
    user_status: 'Active'
  },
  // Staff User 8: Internal / External Auditor
  {
    user_id: 'usr-staff-8',
    full_name: 'Arvind Swamy, FCA',
    email: 'auditor.arvind@greenvalley.edu',
    phone_number: '+91 98400 44558',
    role_id: 'Staff',
    company_id: 'comp-001',
    branch_ids: ['branch-01', 'branch-02'],
    title: 'Statutory Auditor & Compliance Assessor',
    department: 'Statutory Audit',
    designation: 'Chartered Accountant',
    employee_id: 'EMP-AUD-108',
    assigned_roles: ['Internal / External Auditor'],
    assigned_branch_name: 'All Campuses (Audit Scope)',
    user_status: 'Active'
  },
  // Parent User
  {
    user_id: 'usr-parent',
    full_name: 'Meena Kumar',
    email: 'parent.meena@gmail.com',
    phone_number: '+91 98400 99887',
    role_id: 'Parent',
    company_id: 'comp-001',
    branch_ids: ['branch-01'],
    title: 'Parent / Guardian',
    department: 'Guardian Portal',
    designation: 'Parent',
    employee_id: 'PAR-101',
    user_status: 'Active'
  }
];

export const MOCK_ACCOUNT_GROUPS: AccountGroup[] = [
  { group_id: 'grp-asset', group_code: 'ASSET', group_name: 'Current Assets', account_nature: 'Asset', statement_class: 'Balance Sheet', is_system_group: true, is_active: true },
  { group_id: 'grp-bank', group_code: 'BANK', group_name: 'Bank Accounts', parent_group_id: 'grp-asset', account_nature: 'Asset', statement_class: 'Balance Sheet', is_system_group: true, is_active: true },
  { group_id: 'grp-rec', group_code: 'REC', group_name: 'Student Fee Receivables', parent_group_id: 'grp-asset', account_nature: 'Asset', statement_class: 'Balance Sheet', is_system_group: true, is_active: true },
  { group_id: 'grp-liability', group_code: 'LIAB', group_name: 'Current Liabilities', account_nature: 'Liability', statement_class: 'Balance Sheet', is_system_group: true, is_active: true },
  { group_id: 'grp-income', group_code: 'INC', group_name: 'Fee & Other Incomes', account_nature: 'Income', statement_class: 'Income & Expenditure', is_system_group: true, is_active: true },
  { group_id: 'grp-exp', group_code: 'EXP', group_name: 'Operating & Admin Expenses', account_nature: 'Expense', statement_class: 'Income & Expenditure', is_system_group: true, is_active: true }
];

export const MOCK_LEDGERS: Ledger[] = [
  {
    ledger_id: 'ledger-bank-sbi',
    company_id: 'comp-001',
    ledger_code: 'LEDG-SBI-01',
    ledger_name: 'State Bank of India - Chennai Main',
    group_id: 'grp-bank',
    ledger_type: 'Bank',
    opening_balance: 4500000,
    opening_balance_side: 'DEBIT',
    bill_wise_enabled: false,
    cost_centre_enabled: true,
    reconciliation_enabled: true,
    is_system_control_ledger: false,
    ledger_status: 'Active'
  },
  {
    ledger_id: 'ledger-gateway-clr',
    company_id: 'comp-001',
    ledger_code: 'LEDG-GW-CLR',
    ledger_name: 'Razorpay Gateway Clearing Account',
    group_id: 'grp-bank',
    ledger_type: 'Bank',
    opening_balance: 125000,
    opening_balance_side: 'DEBIT',
    bill_wise_enabled: false,
    cost_centre_enabled: false,
    reconciliation_enabled: true,
    is_system_control_ledger: true,
    ledger_status: 'Active'
  },
  {
    ledger_id: 'ledger-tuition-inc',
    company_id: 'comp-001',
    ledger_code: 'LEDG-TUIT-INC',
    ledger_name: 'Tuition Fee Income',
    group_id: 'grp-income',
    ledger_type: 'Income',
    opening_balance: 0,
    opening_balance_side: 'CREDIT',
    bill_wise_enabled: false,
    cost_centre_enabled: true,
    reconciliation_enabled: false,
    is_system_control_ledger: false,
    ledger_status: 'Active'
  },
  {
    ledger_id: 'ledger-salary-exp',
    company_id: 'comp-001',
    ledger_code: 'LEDG-SAL-EXP',
    ledger_name: 'Staff Salaries & Allowances',
    group_id: 'grp-exp',
    ledger_type: 'Expense',
    opening_balance: 0,
    opening_balance_side: 'DEBIT',
    bill_wise_enabled: false,
    cost_centre_enabled: true,
    reconciliation_enabled: false,
    is_system_control_ledger: false,
    ledger_status: 'Active'
  }
];

export const MOCK_COST_CENTRES: CostCentre[] = [
  { cost_centre_id: 'cc-01', category_name: 'School Section', cost_centre_code: 'CC-PRIMARY', cost_centre_name: 'Primary School (Grades 1-5)', branch_id: 'branch-01', is_active: true },
  { cost_centre_id: 'cc-02', category_name: 'School Section', cost_centre_code: 'CC-MIDDLE', cost_centre_name: 'Middle School (Grades 6-8)', branch_id: 'branch-01', is_active: true },
  { cost_centre_id: 'cc-03', category_name: 'Department', cost_centre_code: 'CC-SCIENCE', cost_centre_name: 'Science & Computer Laboratories', branch_id: 'branch-01', is_active: true },
  { cost_centre_id: 'cc-04', category_name: 'Department', cost_centre_code: 'CC-SPORTS', cost_centre_name: 'Athletics & Sports Complex', branch_id: 'branch-02', is_active: true }
];

export const MOCK_VOUCHERS: AccountingVoucher[] = [
  {
    voucher_id: 'vouch-001',
    voucher_number: 'JV-2026-0001',
    company_id: 'comp-001',
    branch_id: 'branch-01',
    financial_year_id: 'fy-2026-27',
    voucher_type_id: 'Journal',
    voucher_date: '2026-04-10',
    narration: 'Opening balance adjustments and annual software provisioning.',
    is_posted: true,
    created_at: '2026-04-10 11:30:00',
    total_debit: 150000,
    total_credit: 150000,
    lines: [
      { voucher_line_id: 'vl-01', ledger_id: 'ledger-salary-exp', line_number: 1, debit_amount: 150000, credit_amount: 0, cost_centre_id: 'cc-03' },
      { voucher_line_id: 'vl-02', ledger_id: 'ledger-bank-sbi', line_number: 2, debit_amount: 0, credit_amount: 150000 }
    ]
  },
  {
    voucher_id: 'vouch-002',
    voucher_number: 'RV-2026-0015',
    company_id: 'comp-001',
    branch_id: 'branch-01',
    financial_year_id: 'fy-2026-27',
    voucher_type_id: 'Receipt',
    voucher_date: '2026-04-12',
    narration: 'Online fee collections batch #412 auto-posted from Razorpay settlement.',
    is_posted: true,
    created_at: '2026-04-12 16:45:00',
    total_debit: 350000,
    total_credit: 350000,
    lines: [
      { voucher_line_id: 'vl-03', ledger_id: 'ledger-bank-sbi', line_number: 1, debit_amount: 350000, credit_amount: 0 },
      { voucher_line_id: 'vl-04', ledger_id: 'ledger-tuition-inc', line_number: 2, debit_amount: 0, credit_amount: 350000, cost_centre_id: 'cc-01' }
    ]
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    student_id: 'student-101',
    admission_number: 'GV-2026-045',
    student_name: 'Aarav Kumar',
    branch_id: 'branch-01',
    academic_year_id: 'ay-2026-27',
    class_id: 'Class 8',
    section_id: 'Section A',
    admission_date: '2021-06-05',
    student_status: 'Active'
  },
  {
    student_id: 'student-102',
    admission_number: 'GV-2026-046',
    student_name: 'Ananya Kumar',
    branch_id: 'branch-01',
    academic_year_id: 'ay-2026-27',
    class_id: 'Class 5',
    section_id: 'Section B',
    admission_date: '2023-06-01',
    student_status: 'Active'
  },
  {
    student_id: 'student-103',
    admission_number: 'GV-2026-089',
    student_name: 'Rohan Sharma',
    branch_id: 'branch-01',
    academic_year_id: 'ay-2026-27',
    class_id: 'Class 10',
    section_id: 'Section A',
    admission_date: '2019-06-10',
    student_status: 'Active'
  }
];

export const MOCK_GUARDIANS: Guardian[] = [
  {
    guardian_id: 'guard-01',
    full_name: 'Meena Kumar',
    email: 'parent.meena@gmail.com',
    phone_number: '+91 98400 99887',
    portal_status: 'Active'
  }
];

export const MOCK_STUDENT_GUARDIANS: StudentGuardian[] = [
  {
    student_guardian_id: 'sg-01',
    student_id: 'student-101',
    guardian_id: 'guard-01',
    relationship_type: 'Mother',
    can_view_finance: true,
    can_make_payment: true
  },
  {
    student_guardian_id: 'sg-02',
    student_id: 'student-102',
    guardian_id: 'guard-01',
    relationship_type: 'Mother',
    can_view_finance: true,
    can_make_payment: true
  }
];

export const MOCK_FEE_HEADS: FeeHead[] = [
  { fee_head_id: 'fh-1', fee_head_code: 'TUITION', fee_head_name: 'Term Tuition Fee', income_ledger_id: 'ledger-tuition-inc' },
  { fee_head_id: 'fh-2', fee_head_code: 'TRANSPORT', fee_head_name: 'School Bus Transport', income_ledger_id: 'ledger-tuition-inc' },
  { fee_head_id: 'fh-3', fee_head_code: 'LAB', fee_head_name: 'Science & Robotics Lab', income_ledger_id: 'ledger-tuition-inc' },
  { fee_head_id: 'fh-4', fee_head_code: 'ACTIVITY', fee_head_name: 'Sports & Extra-Curricular', income_ledger_id: 'ledger-tuition-inc' }
];

export const MOCK_FEE_PLANS: FeePlan[] = [
  {
    fee_plan_id: 'plan-01',
    plan_name: 'Middle School Standard Fee Plan (Class 6-8)',
    academic_year_id: 'ay-2026-27',
    branch_id: 'branch-01',
    class_id: 'Class 8',
    plan_status: 'Published',
    lines: [
      { fee_plan_line_id: 'fpl-1', fee_head_id: 'fh-1', amount: 35000, billing_frequency: 'Term', due_date: '2026-06-10' },
      { fee_plan_line_id: 'fpl-2', fee_head_id: 'fh-2', amount: 12000, billing_frequency: 'Term', due_date: '2026-06-10' },
      { fee_plan_line_id: 'fpl-3', fee_head_id: 'fh-3', amount: 5000, billing_frequency: 'Annual', due_date: '2026-06-10' }
    ]
  }
];

export const MOCK_INVOICES: FeeInvoice[] = [
  {
    fee_invoice_id: 'inv-1001',
    invoice_number: 'INV-2026-1001',
    student_id: 'student-101',
    fee_plan_id: 'plan-01',
    invoice_date: '2026-05-15',
    due_date: '2026-06-10',
    gross_amount: 52000,
    concession_amount: 2000,
    late_fee_amount: 0,
    net_amount: 50000,
    invoice_status: 'PartPaid',
    lines: [
      { fee_invoice_line_id: 'invl-1', fee_head_id: 'fh-1', line_amount: 35000, line_description: 'Tuition Fee Term 1' },
      { fee_invoice_line_id: 'invl-2', fee_head_id: 'fh-2', line_amount: 12000, line_description: 'Transport Fee Term 1' },
      { fee_invoice_line_id: 'invl-3', fee_head_id: 'fh-3', line_amount: 5000, line_description: 'Lab Fee Annual' }
    ]
  },
  {
    fee_invoice_id: 'inv-1002',
    invoice_number: 'INV-2026-1002',
    student_id: 'student-102',
    fee_plan_id: 'plan-01',
    invoice_date: '2026-05-15',
    due_date: '2026-06-10',
    gross_amount: 42000,
    concession_amount: 0,
    late_fee_amount: 0,
    net_amount: 42000,
    invoice_status: 'Issued',
    lines: [
      { fee_invoice_line_id: 'invl-4', fee_head_id: 'fh-1', line_amount: 35000, line_description: 'Tuition Fee Term 1' },
      { fee_invoice_line_id: 'invl-5', fee_head_id: 'fh-4', line_amount: 7000, line_description: 'Activity Fee' }
    ]
  }
];

export const MOCK_PAYMENTS: FeePayment[] = [
  {
    fee_payment_id: 'pay-001',
    student_id: 'student-101',
    payment_amount: 25000,
    payment_mode: 'Online / Gateway',
    payment_status: 'Success',
    payment_date: '2026-05-18 10:20:00',
    bank_account_id: 'bank-01',
    gateway_payment_id: 'pay_razor_9921',
    payment_reference: 'TXN-99881122',
    allocated_invoices: [{ fee_invoice_id: 'inv-1001', allocated_amount: 25000 }]
  }
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    bank_account_id: 'bank-01',
    company_id: 'comp-001',
    bank_name: 'State Bank of India',
    account_nickname: 'SBI Chennai Main Operating A/C',
    account_holder_name: 'Green Valley Education Trust',
    account_number_last4: '4589',
    ifsc_code: 'SBIN0000800',
    account_type: 'Current',
    currency_code: 'INR',
    ledger_id: 'ledger-bank-sbi',
    opening_book_balance: 4500000,
    allow_receipts: true,
    allow_payments: true,
    account_status: 'Active'
  },
  {
    bank_account_id: 'bank-02',
    company_id: 'comp-001',
    bank_name: 'HDFC Bank',
    account_nickname: 'HDFC School Fee Collection A/C',
    account_holder_name: 'Green Valley Education Trust',
    account_number_last4: '9012',
    ifsc_code: 'HDFC0001234',
    account_type: 'Current',
    currency_code: 'INR',
    ledger_id: 'ledger-bank-sbi',
    opening_book_balance: 1850000,
    allow_receipts: true,
    allow_payments: false,
    account_status: 'Active'
  }
];

export const MOCK_GATEWAYS: PaymentGateway[] = [
  {
    gateway_id: 'gw-01',
    gateway_name: 'Razorpay PG',
    merchant_account_id: 'rzp_live_GvSchool2026',
    clearing_ledger_id: 'ledger-gateway-clr',
    charges_ledger_id: 'ledger-salary-exp',
    settlement_bank_account_id: 'bank-01',
    gateway_status: 'Active'
  }
];

export const MOCK_STATEMENTS: BankStatement[] = [
  {
    statement_id: 'stmt-001',
    bank_account_id: 'bank-01',
    statement_from_date: '2026-04-01',
    statement_to_date: '2026-04-30',
    file_name: 'SBI_Chennai_April_2026.csv',
    opening_balance: 4500000,
    closing_balance: 4635000,
    upload_status: 'Validated',
    lines: [
      {
        statement_line_id: 'sl-1',
        statement_id: 'stmt-001',
        transaction_date: '2026-04-12',
        value_date: '2026-04-12',
        description: 'Razorpay Settlements Batch #412',
        reference_number: 'CMS4129901',
        debit_amount: 0,
        credit_amount: 350000,
        bank_running_balance: 4850000,
        is_reconciled: true
      },
      {
        statement_line_id: 'sl-2',
        statement_id: 'stmt-001',
        transaction_date: '2026-04-18',
        value_date: '2026-04-18',
        description: 'NEFT Clg - Campus Electrical Works',
        reference_number: 'N04188277',
        debit_amount: 115000,
        credit_amount: 0,
        bank_running_balance: 4735000,
        is_reconciled: true
      }
    ]
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    vendor_id: 'vend-01',
    vendor_code: 'VEND-001',
    vendor_name: 'ABC School Supplies & Books Pvt Ltd',
    pan: 'AABCA1234F',
    gstin: '33AABCA1234F1Z5',
    email: 'accounts@abcschoolsupplies.in',
    phone_number: '+91 98410 44556',
    payment_terms_days: 30
  },
  {
    vendor_id: 'vend-02',
    vendor_code: 'VEND-002',
    vendor_name: 'Speedy Transport Fleet Services',
    pan: 'BBCDE5678G',
    gstin: '33BBCDE5678G1Z8',
    email: 'billing@speedyfleet.com',
    phone_number: '+91 98410 77889',
    payment_terms_days: 15
  }
];

export const MOCK_VENDOR_BILLS: VendorBill[] = [
  {
    vendor_bill_id: 'vb-001',
    vendor_id: 'vend-01',
    supplier_invoice_number: 'INV/2026/998',
    supplier_invoice_date: '2026-11-10',
    due_date: '2026-12-10',
    expense_ledger_id: 'ledger-salary-exp',
    taxable_amount: 85000,
    tax_amount: 15000,
    gross_amount: 100000,
    outstanding_amount: 100000,
    status: 'Approved'
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { 
    employee_id: 'emp-01', 
    employee_code: 'EMP-101', 
    employee_name: 'Suresh Kumar', 
    branch_id: 'branch-01', 
    department_id: 'cc-03', 
    joining_date: '2021-06-01', 
    employee_status: 'Active', 
    gross_salary: 65000,
    designation: 'Senior Science Faculty',
    email: 'suresh.kumar@greenvalley.edu'
  },
  { 
    employee_id: 'emp-02', 
    employee_code: 'EMP-102', 
    employee_name: 'Lakshmi Priya', 
    branch_id: 'branch-01', 
    department_id: 'cc-03', 
    joining_date: '2022-06-01', 
    employee_status: 'Active', 
    gross_salary: 55000,
    designation: 'Mathematics Lecturer',
    email: 'lakshmi.priya@greenvalley.edu'
  },
  { 
    employee_id: 'emp-03', 
    employee_code: 'EMP-103', 
    employee_name: 'Karthik V.', 
    branch_id: 'branch-02', 
    department_id: 'cc-04', 
    joining_date: '2023-01-15', 
    employee_status: 'Active', 
    gross_salary: 42000,
    designation: 'Physical Education Coach',
    email: 'karthik.v@greenvalley.edu'
  },
  { 
    employee_id: 'emp-04', 
    employee_code: 'EMP-104', 
    employee_name: 'Anjali Menon', 
    branch_id: 'branch-01', 
    department_id: 'cc-01', 
    joining_date: '2020-07-01', 
    employee_status: 'Active', 
    gross_salary: 58000,
    designation: 'English Department Head',
    email: 'anjali.menon@greenvalley.edu'
  },
  { 
    employee_id: 'emp-05', 
    employee_code: 'EMP-105', 
    employee_name: 'Manoj Pillai', 
    branch_id: 'branch-01', 
    department_id: 'cc-03', 
    joining_date: '2024-02-01', 
    employee_status: 'Active', 
    gross_salary: 48000,
    designation: 'Computer Science Instructor',
    email: 'manoj.pillai@greenvalley.edu'
  }
];

// COMPREHENSIVE ATTENDANCE DATA (WITH VALIDATION, TIME CALCULATIONS & REMARKS)
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    attendance_id: 'att-001',
    employee_id: 'emp-01',
    employee_code: 'EMP-101',
    employee_name: 'Suresh Kumar',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-17',
    status: 'Present',
    check_in_time: '08:25',
    check_out_time: '16:30',
    worked_hours: 8.08,
    remarks: 'On time for morning laboratory session',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-17 08:30:00'
  },
  {
    attendance_id: 'att-002',
    employee_id: 'emp-02',
    employee_code: 'EMP-102',
    employee_name: 'Lakshmi Priya',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-17',
    status: 'Present',
    check_in_time: '08:30',
    check_out_time: '16:35',
    worked_hours: 8.08,
    remarks: 'Invigilation duty completed',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-17 08:35:00'
  },
  {
    attendance_id: 'att-003',
    employee_id: 'emp-03',
    employee_code: 'EMP-103',
    employee_name: 'Karthik V.',
    branch_id: 'branch-02',
    branch_name: 'Coimbatore Campus',
    department: 'Athletics & Sports',
    attendance_date: '2026-11-17',
    status: 'Half Day',
    check_in_time: '08:45',
    check_out_time: '12:45',
    worked_hours: 4.0,
    remarks: 'Inter-school tournament travel in afternoon',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-17 12:50:00'
  },
  {
    attendance_id: 'att-004',
    employee_id: 'emp-04',
    employee_code: 'EMP-104',
    employee_name: 'Anjali Menon',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Primary School (Grades 1-5)',
    attendance_date: '2026-11-17',
    status: 'Leave',
    remarks: 'Approved casual leave (prior notice given)',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-16 17:00:00'
  },
  {
    attendance_id: 'att-005',
    employee_id: 'emp-05',
    employee_code: 'EMP-105',
    employee_name: 'Manoj Pillai',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-17',
    status: 'Absent',
    remarks: 'Uninformed absence - SMS notification sent to faculty',
    last_updated_by: 'System Automated Monitor',
    last_updated_time: '2026-11-17 10:00:00'
  },
  // Yesterday's records
  {
    attendance_id: 'att-006',
    employee_id: 'emp-01',
    employee_code: 'EMP-101',
    employee_name: 'Suresh Kumar',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-16',
    status: 'Present',
    check_in_time: '08:20',
    check_out_time: '16:30',
    worked_hours: 8.16,
    remarks: 'Full day completed',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-16 16:35:00'
  },
  {
    attendance_id: 'att-007',
    employee_id: 'emp-02',
    employee_code: 'EMP-102',
    employee_name: 'Lakshmi Priya',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-16',
    status: 'Present',
    check_in_time: '08:35',
    check_out_time: '16:40',
    worked_hours: 8.08,
    remarks: 'Full day completed',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-16 16:45:00'
  },
  {
    attendance_id: 'att-008',
    employee_id: 'emp-03',
    employee_code: 'EMP-103',
    employee_name: 'Karthik V.',
    branch_id: 'branch-02',
    branch_name: 'Coimbatore Campus',
    department: 'Athletics & Sports',
    attendance_date: '2026-11-16',
    status: 'Present',
    check_in_time: '08:15',
    check_out_time: '17:00',
    worked_hours: 8.75,
    remarks: 'Evening sports drill supervised',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-16 17:05:00'
  },
  {
    attendance_id: 'att-009',
    employee_id: 'emp-04',
    employee_code: 'EMP-104',
    employee_name: 'Anjali Menon',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Primary School (Grades 1-5)',
    attendance_date: '2026-11-16',
    status: 'Present',
    check_in_time: '08:30',
    check_out_time: '16:30',
    worked_hours: 8.0,
    remarks: 'Parent-teacher conference attended',
    last_updated_by: 'Anant Varma (HR)',
    last_updated_time: '2026-11-16 16:35:00'
  },
  {
    attendance_id: 'att-010',
    employee_id: 'emp-05',
    employee_code: 'EMP-105',
    employee_name: 'Manoj Pillai',
    branch_id: 'branch-01',
    branch_name: 'Chennai Main Campus',
    department: 'Science & Laboratories',
    attendance_date: '2026-11-16',
    status: 'Holiday',
    remarks: 'Campus local holiday (regional festival)',
    last_updated_by: 'System Holiday Calendar',
    last_updated_time: '2026-11-16 00:00:00'
  }
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
  {
    payroll_run_id: 'pr-2026-10',
    month_name: 'October 2026',
    branch_id: 'branch-01',
    employee_count: 5,
    gross_earnings: 268000,
    employee_deductions: 21500,
    employer_contributions: 28400,
    net_pay: 246500,
    status: 'Paid'
  },
  {
    payroll_run_id: 'pr-2026-11',
    month_name: 'November 2026',
    branch_id: 'branch-01',
    employee_count: 5,
    gross_earnings: 268000,
    employee_deductions: 21500,
    employer_contributions: 28400,
    net_pay: 246500,
    status: 'Approved'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    audit_log_id: 'aud-001',
    timestamp: '2026-11-17 08:30:00',
    user_name: 'Anant Varma',
    role: 'Staff (Payroll & HR Officer)',
    action_type: 'CREATE',
    module: 'Payroll Attendance',
    details: 'Logged daily morning attendance for 5 active staff members at Chennai Main Campus'
  },
  {
    audit_log_id: 'aud-002',
    timestamp: '2026-11-16 16:15:00',
    user_name: 'Kavitha Ranganathan',
    role: 'Admin',
    action_type: 'APPROVE',
    module: 'Role & Permission Assignment',
    details: 'Assigned role "Finance Head / Controller" to Ramesh Narayan with branches [CHN-01, CBE-02]'
  },
  {
    audit_log_id: 'aud-003',
    timestamp: '2026-11-15 14:15:00',
    user_name: 'Kavitha Ranganathan',
    role: 'Admin',
    action_type: 'POST',
    module: 'Accounting Vouchers',
    details: 'Posted voucher PV-2026-0045 for Electricity bill INR 115,000'
  },
  {
    audit_log_id: 'aud-004',
    timestamp: '2026-11-14 10:30:00',
    user_name: 'Dr. Subramanian Iyer',
    role: 'Super Admin',
    action_type: 'UPDATE',
    module: 'Organisation & Subscription Management',
    details: 'Renewed Enterprise Multi-Campus tier for Green Valley Education Trust'
  }
];

// SUPER ADMIN MOCK DATA
export const MOCK_SUBSCRIPTIONS: PlatformSubscription[] = [
  {
    subscription_id: 'sub-001',
    organisation_id: 'org-001',
    organisation_name: 'Green Valley Education Trust',
    plan_name: 'Enterprise Multi-Campus',
    billing_cycle: 'Annual',
    status: 'Active',
    amount: 350000,
    next_renewal_date: '2027-03-31',
    active_branches_count: 3,
    max_branches_allowed: 10,
    features_enabled: ['Double Entry GL', 'Parent Portal', 'Payment Gateway Sync', 'Automated Attendance', 'Maker-Checker Approvals', 'Multi-Campus Consolidation']
  },
  {
    subscription_id: 'sub-002',
    organisation_id: 'org-002',
    organisation_name: 'St. Xavier Educational Society',
    plan_name: 'Trust Ultimate',
    billing_cycle: 'Annual',
    status: 'Active',
    amount: 550000,
    next_renewal_date: '2027-05-15',
    active_branches_count: 6,
    max_branches_allowed: 25,
    features_enabled: ['All Modules', 'Dedicated Cloud SQL', 'Multi-Campus Attendance', 'TDS & GST Automation']
  },
  {
    subscription_id: 'sub-003',
    organisation_id: 'org-003',
    organisation_name: 'Delhi Public School Foundation',
    plan_name: 'Standard Campus',
    billing_cycle: 'Quarterly',
    status: 'Renewed',
    amount: 95000,
    next_renewal_date: '2026-12-31',
    active_branches_count: 1,
    max_branches_allowed: 2,
    features_enabled: ['Student Fees', 'Basic GL', 'Attendance Portal']
  }
];

export const MOCK_PLATFORM_USERS: PlatformUser[] = [
  { id: 'pu-1', name: 'Dr. Subramanian Iyer', email: 'superadmin@greenvalley.edu', role: 'Super Admin', organisation: 'Green Valley Education Trust', branch: 'Central Trust HQ', status: 'Active', last_login: 'Just now' },
  { id: 'pu-2', name: 'Kavitha Ranganathan', email: 'admin@greenvalley.edu', role: 'Branch Admin', organisation: 'Green Valley Education Trust', branch: 'Chennai Main Campus', status: 'Active', last_login: '10 mins ago' },
  { id: 'pu-3', name: 'R. Balasubramanian', email: 'bala.cbe@greenvalley.edu', role: 'Branch Admin', organisation: 'Green Valley Education Trust', branch: 'Coimbatore Campus', status: 'Active', last_login: '2 hours ago' },
  { id: 'pu-4', name: 'Ramesh Narayan', email: 'ramesh.narayan@greenvalley.edu', role: 'Staff', organisation: 'Green Valley Education Trust', branch: 'Chennai Main Campus', status: 'Active', last_login: '1 hour ago' },
  { id: 'pu-5', name: 'Meena Kumar', email: 'parent.meena@gmail.com', role: 'Parent', organisation: 'Green Valley Education Trust', branch: 'Chennai Main Campus', status: 'Active', last_login: 'Today at 09:15' },
  { id: 'pu-6', name: 'Former Cashier User', email: 'ex.cashier@greenvalley.edu', role: 'Staff', organisation: 'Green Valley Education Trust', branch: 'Chennai Main Campus', status: 'Locked', last_login: '14 days ago' }
];

export const MOCK_BUDGETS: BudgetRecord[] = [
  { budget_id: 'bud-01', branch_id: 'branch-01', fiscal_year: 'FY 2026-27', category: 'Science Laboratories & Robotics Equipment', allocated_amount: 1200000, spent_amount: 850000, pending_commitments: 100000, status: 'Approved' },
  { budget_id: 'bud-02', branch_id: 'branch-01', fiscal_year: 'FY 2026-27', category: 'Library Books & Digital Journal Subscriptions', allocated_amount: 400000, spent_amount: 280000, pending_commitments: 20000, status: 'Approved' },
  { budget_id: 'bud-03', branch_id: 'branch-01', fiscal_year: 'FY 2026-27', category: 'Campus Solar Energy & Green Infrastructure', allocated_amount: 2500000, spent_amount: 1400000, pending_commitments: 450000, status: 'Approved' },
  { budget_id: 'bud-04', branch_id: 'branch-02', fiscal_year: 'FY 2026-27', category: 'Sports Complex Turf Maintenance & Gear', allocated_amount: 800000, spent_amount: 510000, pending_commitments: 80000, status: 'Approved' }
];

export const MOCK_FIXED_ASSETS: FixedAssetRecord[] = [
  { asset_id: 'ast-01', asset_code: 'BUS-CHN-01', asset_name: 'Tata Starbus 42-Seater (School Bus #1)', category: 'Motor Vehicles', branch_id: 'branch-01', purchase_date: '2023-04-15', purchase_value: 2800000, current_book_value: 2150000, depreciation_rate: 15, status: 'In Use' },
  { asset_id: 'ast-02', asset_code: 'BUS-CHN-02', asset_name: 'Tata Starbus 42-Seater (School Bus #2)', category: 'Motor Vehicles', branch_id: 'branch-01', purchase_date: '2023-04-15', purchase_value: 2800000, current_book_value: 2150000, depreciation_rate: 15, status: 'In Use' },
  { asset_id: 'ast-03', asset_code: 'SRV-DL380', asset_name: 'HPE ProLiant DL380 Campus Virtualization Server', category: 'IT & Computing', branch_id: 'branch-01', purchase_date: '2024-01-20', purchase_value: 850000, current_book_value: 680000, depreciation_rate: 20, status: 'In Use' },
  { asset_id: 'ast-04', asset_code: 'LAB-SPECTRO', asset_name: 'UV-Visible Double Beam Spectrophotometer', category: 'Laboratory Equipment', branch_id: 'branch-01', purchase_date: '2024-08-10', purchase_value: 320000, current_book_value: 295000, depreciation_rate: 10, status: 'In Use' }
];

export const MOCK_TAX_RULES: TaxRule[] = [
  { tax_rule_id: 'tr-01', rule_name: 'GST on Commercial Transport & Leasing (18%)', tax_type: 'GST', rate_percentage: 18, section_code: 'SAC 9965', effective_from: '2026-04-01', is_active: true },
  { tax_rule_id: 'tr-02', rule_name: 'TDS on Contractor Payments (Section 194C)', tax_type: 'TDS', rate_percentage: 2, section_code: '194C', effective_from: '2026-04-01', is_active: true },
  { tax_rule_id: 'tr-03', rule_name: 'TDS on Professional & Legal Fees (Section 194J)', tax_type: 'TDS', rate_percentage: 10, section_code: '194J', effective_from: '2026-04-01', is_active: true },
  { tax_rule_id: 'tr-04', rule_name: 'TDS on Salaries (Section 192)', tax_type: 'TDS', rate_percentage: 12.5, section_code: '192', effective_from: '2026-04-01', is_active: true }
];
