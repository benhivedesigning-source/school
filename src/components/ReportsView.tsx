import React, { useState } from 'react';
import { Download, CheckCircle2, TrendingUp, TrendingDown, Landmark, BookOpen, AlertCircle } from 'lucide-react';

interface ReportsViewProps {
  initialTab?: 'trial_balance' | 'income_exp' | 'balance_sheet' | 'day_book' | 'outstanding';
}

export const ReportsView: React.FC<ReportsViewProps> = ({ initialTab = 'trial_balance' }) => {
  const [reportType, setReportType] = useState<'trial_balance' | 'income_exp' | 'balance_sheet' | 'day_book' | 'outstanding'>(initialTab);
  React.useEffect(() => {
    if (initialTab) setReportType(initialTab);
  }, [initialTab]);

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <button
        onClick={() => alert('Official financial report generated and exported successfully as PDF / Excel spreadsheet.')}
        className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Export Current Statement</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. Trial Balance */}
      {reportType === 'trial_balance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Trial Balance (Green Valley School - FY 2026-27)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Automated aggregation of all ledger balances across active cost centres</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Books in Balance (Debit = Credit)
              </span>
              {sectionControls}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Ledger Name</th>
                  <th className="pb-3.5">Account Group</th>
                  <th className="pb-3.5 text-right">Debit Balance (₹)</th>
                  <th className="pb-3.5 text-right">Credit Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 font-bold text-slate-900 text-sm">State Bank of India - Chennai Main</td>
                  <td className="py-4 text-slate-500 font-medium">Bank Accounts</td>
                  <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹46,35,000</td>
                  <td className="py-4 text-right text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 font-bold text-slate-900 text-sm">Student Fee Control Receivable</td>
                  <td className="py-4 text-slate-500 font-medium">Student Fee Receivables</td>
                  <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹18,50,000</td>
                  <td className="py-4 text-right text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 font-bold text-slate-900 text-sm">Tuition Fee Income</td>
                  <td className="py-4 text-slate-500 font-medium">Fee & Other Incomes</td>
                  <td className="py-4 text-right text-slate-400">-</td>
                  <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹89,50,000</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 font-bold text-slate-900 text-sm">Staff Salaries & Allowances</td>
                  <td className="py-4 text-slate-500 font-medium">Operating Expenses</td>
                  <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹34,20,000</td>
                  <td className="py-4 text-right text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 font-bold text-slate-900 text-sm">Sundry Creditors (Vendor Payables)</td>
                  <td className="py-4 text-slate-500 font-medium">Current Liabilities</td>
                  <td className="py-4 text-right text-slate-400">-</td>
                  <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹9,55,000</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-bold text-slate-900 text-sm bg-[#FAF7F3]/50">
                  <td className="py-4 pl-2" colSpan={2}>Total Trial Balance</td>
                  <td className="py-4 text-right text-burgundy-700 font-extrabold tabular-nums">₹99,05,000</td>
                  <td className="py-4 text-right text-burgundy-700 font-extrabold tabular-nums pr-2">₹99,05,000</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 2. Income & Expenditure */}
      {reportType === 'income_exp' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Income & Expenditure Statement (YTD)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Surplus/Deficit performance calculated from posted journal vouchers</p>
            </div>
            {sectionControls}
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Total Operating Incomes</div>
                  <div className="text-slate-500 text-xs mt-0.5 font-medium">Tuition, Transport, Lab & Grants</div>
                </div>
              </div>
              <div className="text-emerald-700 font-bold text-xl tabular-nums">₹1,24,50,000</div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Total Operating Expenses</div>
                  <div className="text-slate-500 text-xs mt-0.5 font-medium">Salaries, Campus Utilities, Maintenance & Supplies</div>
                </div>
              </div>
              <div className="text-rose-600 font-bold text-xl tabular-nums">₹68,20,000</div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-burgundy-50 to-emerald-50 border border-burgundy-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-[#8B3552] text-white shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-burgundy-950 text-base">Net Operating Surplus</div>
                  <div className="text-burgundy-700 text-xs mt-0.5 font-medium">Excess of Income over Expenditure transferred to Corpus Fund</div>
                </div>
              </div>
              <div className="text-burgundy-800 font-extrabold text-2xl tabular-nums">₹56,30,000</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Balance Sheet */}
      {reportType === 'balance_sheet' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Balance Sheet Summary</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Consolidated statement of assets, liabilities and trust capital fund</p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-6 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Landmark className="w-4 h-4 text-burgundy-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Assets</h4>
                </div>
                <span className="font-mono text-xs font-bold text-burgundy-700">₹5,14,85,000</span>
              </div>
              <div className="space-y-3 text-slate-600 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Bank Balances & Cash</span>
                  <strong className="text-slate-900 text-xs font-bold tabular-nums">₹46,35,000</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Student Fee Receivables</span>
                  <strong className="text-slate-900 text-xs font-bold tabular-nums">₹18,50,000</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Fixed Assets & School Infrastructure</span>
                  <strong className="text-slate-900 text-xs font-bold tabular-nums">₹4,50,00,000</strong>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Landmark className="w-4 h-4 text-burgundy-700" />
                  <h4 className="font-bold text-slate-900 text-sm">Liabilities & Corpus Fund</h4>
                </div>
                <span className="font-mono text-xs font-bold text-burgundy-700">₹5,14,85,000</span>
              </div>
              <div className="space-y-3 text-slate-600 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Sundry Creditors (Vendor Payables)</span>
                  <strong className="text-slate-900 text-xs font-bold tabular-nums">₹9,55,000</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Educational Trust Corpus Fund</span>
                  <strong className="text-slate-900 text-xs font-bold tabular-nums">₹4,49,00,000</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Current Year Operating Surplus</span>
                  <strong className="text-emerald-700 text-xs font-bold tabular-nums">₹56,30,000</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Day Book & Ledger Extract */}
      {reportType === 'day_book' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Day Book & Chronological Transaction Extract</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Audit-ready sequential journal entries across all cash, bank and adjustment vouchers</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5">Voucher #</th>
                  <th className="pb-3.5">Voucher Type</th>
                  <th className="pb-3.5">Debit Ledger / Particulars</th>
                  <th className="pb-3.5">Credit Ledger</th>
                  <th className="pb-3.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 text-slate-500 font-medium">2026-11-14</td>
                  <td className="py-4 font-mono font-bold text-burgundy-700">RV-2026-0012</td>
                  <td className="py-4 font-bold text-slate-800">Receipt</td>
                  <td className="py-4 font-medium text-slate-900">SBI Bank Current A/c</td>
                  <td className="py-4 text-slate-600">Student Fee Control Receivable</td>
                  <td className="py-4 text-right font-black text-slate-900 tabular-nums">₹2,50,000</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 text-slate-500 font-medium">2026-11-15</td>
                  <td className="py-4 font-mono font-bold text-burgundy-700">PV-2026-0045</td>
                  <td className="py-4 font-bold text-slate-800">Payment</td>
                  <td className="py-4 font-medium text-slate-900">Electricity & Power Utility</td>
                  <td className="py-4 text-slate-600">SBI Bank Current A/c</td>
                  <td className="py-4 text-right font-black text-slate-900 tabular-nums">₹1,15,000</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition">
                  <td className="py-4 text-slate-500 font-medium">2026-11-16</td>
                  <td className="py-4 font-mono font-bold text-burgundy-700">JV-2026-0088</td>
                  <td className="py-4 font-bold text-slate-800">Journal</td>
                  <td className="py-4 font-medium text-slate-900">Depreciation on IT Infrastructure</td>
                  <td className="py-4 text-slate-600">Accumulated Depreciation Reserve</td>
                  <td className="py-4 text-right font-black text-slate-900 tabular-nums">₹45,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Outstanding Dues & Aging */}
      {reportType === 'outstanding' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Outstanding Dues & Aging Analysis (Receivables vs Payables)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Bucket-wise aging breakdown (0-30 days, 31-60 days, 61-90 days, & 90+ days)</p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">0 - 30 Days (Current)</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">₹11,50,000</div>
              <div className="text-emerald-700 font-medium">Within regular grace period</div>
            </div>
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">31 - 60 Days</div>
              <div className="text-xl font-bold text-amber-600 tabular-nums">₹4,20,000</div>
              <div className="text-slate-500 font-medium">Automated reminder sent</div>
            </div>
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">61 - 90 Days</div>
              <div className="text-xl font-bold text-amber-700 tabular-nums">₹1,80,000</div>
              <div className="text-slate-500 font-medium">Follow-up calls scheduled</div>
            </div>
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">90+ Days (Critical)</div>
              <div className="text-xl font-bold text-rose-600 tabular-nums">₹1,00,000</div>
              <div className="text-rose-600 font-medium">Requires management escalation</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
