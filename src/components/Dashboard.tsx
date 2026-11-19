import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Company, Branch, FinancialYear, AccountingVoucher, FeeInvoice, DemoRole, UserProfile } from '../types';

interface DashboardProps {
  selectedCompany: Company;
  selectedBranch: Branch;
  selectedFy: FinancialYear;
  vouchers: AccountingVoucher[];
  invoices: FeeInvoice[];
  onNavigate: (tab: string) => void;
  currentRole?: DemoRole;
  staffModules?: string[];
  activeStaffUser?: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  selectedCompany,
  selectedBranch,
  selectedFy,
  vouchers,
  invoices,
  onNavigate,
  currentRole = 'Admin',
  staffModules = ['Finance Head / Controller'],
  activeStaffUser
}) => {
  const totalCollections = 12450000;
  const outstandingFees = invoices.reduce((acc, inv) => acc + (inv.net_amount || 0), 0) + 1850000;
  const bankBalance = 4635000;
  const monthlyExpenses = 3420000;

  const isStaff = currentRole === 'Staff';

  return (
    <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Role Notice for Staff */}
      {isStaff && (
        <div className="p-4 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-burgundy-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B3552] shrink-0"></span>
            <span>
              Signed in as <strong className="text-slate-900">{activeStaffUser?.full_name || 'Staff User'}</strong>. 
              Active Role: <strong className="text-burgundy-700 underline font-mono">{activeStaffUser?.assigned_roles?.[0] || 'Finance Head / Controller'}</strong>.
            </span>
          </div>
          <span className="text-[10px] bg-white px-2.5 py-1 rounded-lg border border-burgundy-200 font-bold text-burgundy-800 shrink-0">
            Navigation Filtered by Role Permissions
          </span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Fee Collections (YTD)</span>
            <div className="p-2 rounded-xl bg-burgundy-50 text-burgundy-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              ₹{(totalCollections / 100000).toFixed(2)} Lakhs
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs last academic year</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Outstanding Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Outstanding Dues</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              ₹{(outstandingFees / 100000).toFixed(2)} Lakhs
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-semibold mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>84 pending student installments</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Bank Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Liquid Bank Balance</span>
            <div className="p-2 rounded-xl bg-champagne-50 text-champagne-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              ₹{(bankBalance / 100000).toFixed(2)} Lakhs
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-champagne-700 font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-reconciled with SBI & HDFC</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Monthly Operating Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Operating Expenses</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
              ₹{(monthlyExpenses / 100000).toFixed(2)} Lakhs
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-semibold mt-1">
              <span>Payroll, Utilities & Maintenance</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Real-time Vouchers & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Day Book Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Recent Posted Vouchers</h3>
              <p className="text-xs text-slate-500 font-medium">Immutable double-entry transaction trail</p>
            </div>
            <button 
              onClick={() => onNavigate('acc_day_book')}
              className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center space-x-1 transition"
            >
              <span>View Day Book</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Voucher #</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Narration</th>
                  <th className="pb-3 text-right">Debit (₹)</th>
                  <th className="pb-3 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vouchers.map(v => (
                  <tr key={v.voucher_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{v.voucher_number}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                        {v.voucher_type_id}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-medium">{v.voucher_date}</td>
                    <td className="py-3.5 max-w-[220px] truncate text-slate-600 font-medium">{v.narration}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">
                      ₹{v.total_debit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">
                      ₹{v.total_credit.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shortcuts & Maker-Checker Approvals */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate('pay_attendance')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Attendance</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Daily & Monthly</div>
              </button>
              <button 
                onClick={() => onNavigate('sm_staff_list')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Staff & Roles</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Assign Permissions</div>
              </button>
              <button 
                onClick={() => onNavigate('sf_invoices')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Fee Invoices</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Dues & Receipts</div>
              </button>
              <button 
                onClick={() => onNavigate('bnk_reconciliation')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Bank Rec</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Statement Match</div>
              </button>
              <button 
                onClick={() => onNavigate('pay_employees')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Payroll</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Salary Runs</div>
              </button>
              <button 
                onClick={() => onNavigate('rep_trial_balance')}
                className="p-3.5 bg-[#FAF7F3] hover:bg-burgundy-50/60 rounded-xl border border-slate-200 text-left transition flex flex-col justify-between shadow-2xs group"
              >
                <div className="text-burgundy-700 font-extrabold text-xs group-hover:text-burgundy-800">Reports</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">Trial Balance</div>
              </button>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-extrabold text-slate-900 text-base">Pending Approvals</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">2 Items</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F3] border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">Vendor Bill #998 (ABC Supplies)</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-medium">Amount: ₹100,000 | Due: Dec 10</div>
                </div>
                <button 
                  onClick={() => onNavigate('appr_pending_approvals')}
                  className="px-3 py-1.5 bg-[#8B3552] text-white font-bold rounded-lg hover:bg-[#722B43] transition shadow-2xs whitespace-nowrap shrink-0"
                >
                  Review
                </button>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F3] border border-slate-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">November Payroll Run (#2026-11)</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-medium">Net Pay: ₹246,500 | 5 Staff</div>
                </div>
                <button 
                  onClick={() => onNavigate('appr_pending_approvals')}
                  className="px-3 py-1.5 bg-[#8B3552] text-white font-bold rounded-lg hover:bg-[#722B43] transition shadow-2xs whitespace-nowrap shrink-0"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
