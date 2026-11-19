export type DemoRole = 'Superadmin' | 'Admin' | 'Staff' | 'Parent';

export type AccountType = 'Super Admin' | 'Admin' | 'Staff' | 'Parent';

export type PortalType = 'Admin Portal' | 'Parent Portal';

export type StaffRoleTemplate =
  | 'Finance Head / Controller'
  | 'Accountant'
  | 'Branch Finance / Cashier Officer'
  | 'Student Fee Administrator'
  | 'Payroll & HR Officer'
  | 'Procurement & Budget Coordinator'
  | 'School Leadership / Governance'
  | 'Internal / External Auditor';

export type ActionPermission = 
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'approve_reject'
  | 'pay_process'
  | 'import'
  | 'export'
  | 'print_download';

export type DataScope = 
  | 'all'
  | 'assigned_branches'
  | 'assigned_bank_accounts'
  | 'linked_children'
  | 'authorised_records';

export interface SubmenuItem {
  id: string;
  title: string;
  desc?: string;
  badge?: string;
  actions: ActionPermission[];
  scope: DataScope;
}

export interface MenuItem {
  id: string;
  title: string;
  iconName: string;
  submenus: SubmenuItem[];
}

export interface RoleDefinition {
  roleId: string;
  roleName: StaffRoleTemplate | string;
  isDefaultTemplate: boolean;
  description: string;
  assignedStaffCount?: number;
  allowedMenus: {
    menuId: string;
    submenuIds: string[];
    actionsBySubmenu?: Record<string, ActionPermission[]>;
    scope?: DataScope;
  }[];
}

export interface Company {
  company_id: string;
  organisation_id: string;
  company_code: string;
  legal_name: string;
  display_name: string;
  entity_type: string;
  base_currency: string;
  books_beginning_date: string;
  company_status: 'Active' | 'Inactive';
}

export interface Branch {
  branch_id: string;
  company_id: string;
  branch_code: string;
  branch_name: string;
  branch_type: 'Head Office' | 'Campus' | 'Regional Office';
  is_head_office: boolean;
  branch_status: 'Active' | 'Inactive';
  branch_admin_name?: string;
  branch_admin_email?: string;
  branch_admin_phone?: string;
}

export interface FinancialYear {
  financial_year_id: string;
  year_name: string;
  start_date: string;
  end_date: string;
  period_status: 'Open' | 'Soft Closed' | 'Locked';
}

export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role_id: DemoRole;
  company_id: string;
  branch_ids: string[];
  assigned_modules?: string[];
  user_status: 'Active' | 'Invited' | 'Locked' | 'Disabled';
  assigned_branch_name?: string;
  title?: string;
  department?: string;
  designation?: string;
  employee_id?: string;
  assigned_roles?: string[]; // e.g. ["Payroll & HR Officer"]
  user_overrides?: {
    deniedSubmenus?: string[];
    grantedSubmenus?: string[];
    actionsOverrides?: Record<string, ActionPermission[]>;
  };
  assigned_bank_account_ids?: string[];
}

export interface AccountGroup {
  group_id: string;
  group_code: string;
  group_name: string;
  parent_group_id?: string;
  account_nature: 'Asset' | 'Liability' | 'Equity-Fund' | 'Income' | 'Expense';
  statement_class: 'Balance Sheet' | 'Income & Expenditure' | 'P&L';
  is_system_group: boolean;
  is_active: boolean;
}

export interface Ledger {
  ledger_id: string;
  company_id: string;
  ledger_code: string;
  ledger_name: string;
  group_id: string;
  ledger_type: 'Bank' | 'Cash' | 'Income' | 'Expense' | 'Receivable' | 'Payable' | 'Tax' | 'General';
  opening_balance: number;
  opening_balance_side: 'DEBIT' | 'CREDIT';
  bill_wise_enabled: boolean;
  cost_centre_enabled: boolean;
  reconciliation_enabled: boolean;
  is_system_control_ledger: boolean;
  ledger_status: 'Active' | 'Inactive';
}

export interface CostCentre {
  cost_centre_id: string;
  category_name: string;
  cost_centre_code: string;
  cost_centre_name: string;
  parent_cost_centre_id?: string;
  branch_id: string;
  is_active: boolean;
}

export interface VoucherLine {
  voucher_line_id: string;
  ledger_id: string;
  line_number: number;
  debit_amount: number;
  credit_amount: number;
  cost_centre_id?: string;
  party_id?: string;
}

export interface AccountingVoucher {
  voucher_id: string;
  voucher_number: string;
  company_id: string;
  branch_id: string;
  financial_year_id: string;
  voucher_type_id: 'Journal' | 'Payment' | 'Receipt' | 'Contra' | 'Sales' | 'Purchase';
  voucher_date: string;
  narration: string;
  reference_number?: string;
  is_posted: boolean;
  status?: string;
  source_module?: string;
  created_by?: string;
  created_at: string;
  lines: VoucherLine[];
  total_debit: number;
  total_credit: number;
}

export interface Student {
  student_id: string;
  admission_number: string;
  student_name: string;
  branch_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  admission_date: string;
  student_status: 'Active' | 'Alumni' | 'Inactive';
}

export interface Guardian {
  guardian_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  portal_status: 'Active' | 'Invited' | 'Locked';
}

export interface StudentGuardian {
  student_guardian_id: string;
  student_id: string;
  guardian_id: string;
  relationship_type: 'Father' | 'Mother' | 'Guardian' | 'Other';
  can_view_finance: boolean;
  can_make_payment: boolean;
}

export interface FeeHead {
  fee_head_id: string;
  fee_head_code: string;
  fee_head_name: string;
  income_ledger_id: string;
}

export interface FeePlanLine {
  fee_plan_line_id: string;
  fee_head_id: string;
  amount: number;
  billing_frequency: 'Annual' | 'Term' | 'Monthly' | 'One-time';
  due_date: string;
}

export interface FeePlan {
  fee_plan_id: string;
  plan_name: string;
  academic_year_id: string;
  branch_id: string;
  class_id: string;
  plan_status: 'Draft' | 'PendingApproval' | 'Approved' | 'Published' | 'Archived';
  lines: FeePlanLine[];
}

export interface FeeInvoiceLine {
  fee_invoice_line_id: string;
  fee_head_id: string;
  line_amount: number;
  line_description: string;
}

export interface FeeInvoice {
  fee_invoice_id: string;
  invoice_number: string;
  student_id: string;
  fee_plan_id: string;
  invoice_date: string;
  due_date: string;
  gross_amount: number;
  concession_amount: number;
  late_fee_amount: number;
  net_amount: number;
  invoice_status: 'Issued' | 'PartPaid' | 'Paid' | 'Overdue' | 'Cancelled';
  lines: FeeInvoiceLine[];
}

export interface FeePayment {
  fee_payment_id: string;
  student_id: string;
  payment_amount: number;
  payment_mode: 'Online / Gateway' | 'Bank Transfer (NEFT/RTGS)' | 'Cheque' | 'Cash';
  payment_status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  payment_date: string;
  bank_account_id?: string;
  gateway_payment_id?: string;
  payment_reference: string;
  accounting_voucher_id?: string;
  allocated_invoices: { fee_invoice_id: string; allocated_amount: number }[];
}

export interface BankAccount {
  bank_account_id: string;
  company_id: string;
  bank_name: string;
  account_nickname: string;
  account_holder_name: string;
  account_number_last4: string;
  ifsc_code: string;
  account_type: 'Current' | 'Savings' | 'Other';
  currency_code: string;
  ledger_id: string;
  opening_book_balance: number;
  allow_receipts: boolean;
  allow_payments: boolean;
  account_status: 'Active' | 'Inactive' | 'Closed';
}

export interface PaymentGateway {
  gateway_id: string;
  gateway_name: string;
  merchant_account_id: string;
  clearing_ledger_id: string;
  charges_ledger_id: string;
  settlement_bank_account_id: string;
  gateway_status: 'Active' | 'TestMode' | 'Inactive';
}

export interface SettlementBatch {
  settlement_batch_id: string;
  gateway_id: string;
  provider_settlement_id: string;
  settlement_date: string;
  gross_amount: number;
  fee_amount: number;
  tax_on_fee_amount: number;
  net_amount: number;
  bank_account_id: string;
  settlement_status: 'Expected' | 'PartSettled' | 'Settled' | 'Disputed';
}

export interface BankStatementLine {
  statement_line_id: string;
  statement_id: string;
  transaction_date: string;
  value_date: string;
  description: string;
  reference_number: string;
  debit_amount: number;
  credit_amount: number;
  bank_running_balance: number;
  is_reconciled: boolean;
}

export interface BankStatement {
  statement_id: string;
  bank_account_id: string;
  statement_from_date: string;
  statement_to_date: string;
  file_name: string;
  opening_balance: number;
  closing_balance: number;
  upload_status: 'Uploaded' | 'Parsed' | 'Validated' | 'Failed';
  lines: BankStatementLine[];
}

export interface BankReconciliation {
  reconciliation_id: string;
  bank_account_id: string;
  statement_id: string;
  period_from: string;
  period_to: string;
  book_balance: number;
  statement_balance: number;
  difference_amount: number;
  reconciliation_status: 'InProgress' | 'PendingReview' | 'Approved' | 'Locked';
}

export interface Vendor {
  vendor_id: string;
  vendor_code: string;
  vendor_name: string;
  pan: string;
  gstin: string;
  email: string;
  phone_number: string;
  payment_terms_days: number;
}

export interface VendorBill {
  vendor_bill_id: string;
  vendor_id: string;
  supplier_invoice_number: string;
  supplier_invoice_date: string;
  due_date: string;
  expense_ledger_id: string;
  taxable_amount: number;
  tax_amount: number;
  gross_amount: number;
  outstanding_amount: number;
  status: 'Draft' | 'Approved' | 'Paid' | 'Overdue';
}

export interface Employee {
  employee_id: string;
  employee_code: string;
  employee_name: string;
  branch_id: string;
  department_id: string;
  joining_date: string;
  employee_status: 'Active' | 'Resigned' | 'OnLeave';
  gross_salary: number;
  designation?: string;
  email?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday';

export interface AttendanceRecord {
  attendance_id: string;
  employee_id: string;
  employee_code: string;
  employee_name: string;
  branch_id: string;
  branch_name: string;
  department: string;
  attendance_date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  check_in_time?: string; // HH:mm
  check_out_time?: string; // HH:mm
  worked_hours?: number; // e.g. 8.5
  remarks?: string;
  last_updated_by: string;
  last_updated_time: string;
}

export interface PayrollRun {
  payroll_run_id: string;
  month_name: string;
  branch_id: string;
  employee_count: number;
  gross_earnings: number;
  employee_deductions: number;
  employer_contributions: number;
  net_pay: number;
  status: 'Draft' | 'PendingApproval' | 'Approved' | 'Paid';
}

export interface AuditLog {
  audit_log_id: string;
  timestamp: string;
  user_name: string;
  role: string;
  action_type: 'CREATE' | 'UPDATE' | 'APPROVE' | 'POST' | 'RECONCILE' | 'DELETE' | 'LOCK' | 'UNLOCK' | 'IMPORT' | 'EXPORT';
  module: string;
  details: string;
  old_values?: string;
  new_values?: string;
}

export interface PlatformSubscription {
  subscription_id: string;
  organisation_id: string;
  organisation_name: string;
  plan_name: 'Standard Campus' | 'Enterprise Multi-Campus' | 'Trust Ultimate';
  billing_cycle: 'Annual' | 'Quarterly' | 'Monthly';
  status: 'Active' | 'Past Due' | 'Trial' | 'Renewed';
  amount: number;
  next_renewal_date: string;
  active_branches_count: number;
  max_branches_allowed: number;
  features_enabled: string[];
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Branch Admin' | 'Staff' | 'Parent';
  organisation: string;
  branch: string;
  status: 'Active' | 'Locked' | 'Invited' | 'Suspended';
  last_login: string;
}

export interface BudgetRecord {
  budget_id: string;
  branch_id: string;
  fiscal_year: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  pending_commitments: number;
  status: 'Approved' | 'Review' | 'Draft';
}

export interface FixedAssetRecord {
  asset_id: string;
  asset_code: string;
  asset_name: string;
  category: string;
  branch_id: string;
  purchase_date: string;
  purchase_value: number;
  current_book_value: number;
  depreciation_rate: number;
  status: 'In Use' | 'Maintenance' | 'Disposed';
}

export interface TaxRule {
  tax_rule_id: string;
  rule_name: string;
  tax_type: 'GST' | 'TDS' | 'Cess';
  rate_percentage: number;
  section_code?: string;
  effective_from: string;
  is_active: boolean;
}
