import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  TrendingUp, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { TaxRule, BudgetRecord, FixedAssetRecord, Branch } from '../types';
import { MOCK_TAX_RULES, MOCK_BUDGETS, MOCK_FIXED_ASSETS } from '../mockData';

interface AdminOperationsViewProps {
  moduleType: 'tax' | 'budgets' | 'inventory' | 'administration';
  branches: Branch[];
  currentRole: string;
  initialTaxTab?: 'rules' | 'gst' | 'tds' | 'challans';
}

export const AdminOperationsView: React.FC<AdminOperationsViewProps> = ({
  moduleType,
  branches,
  currentRole,
  initialTaxTab = 'rules'
}) => {
  // Tax state
  const [taxRules, setTaxRules] = useState<TaxRule[]>(MOCK_TAX_RULES);
  const [taxTab, setTaxTab] = useState<'rules' | 'gst' | 'tds' | 'challans'>(initialTaxTab);
  React.useEffect(() => {
    if (initialTaxTab) setTaxTab(initialTaxTab);
  }, [initialTaxTab]);
  const [showTaxModal, setShowTaxModal] = useState(false);

  // Budget state
  const [budgets, setBudgets] = useState<BudgetRecord[]>(MOCK_BUDGETS);
  const [budgetTab, setBudgetTab] = useState<'overview' | 'lines' | 'donations' | 'funds'>('overview');

  // Inventory & Assets state
  const [assets, setAssets] = useState<FixedAssetRecord[]>(MOCK_FIXED_ASSETS);
  const [inventoryTab, setInventoryTab] = useState<'assets' | 'items' | 'warehouses'>('assets');

  // Admin settings state
  const [adminTab, setAdminTab] = useState<'settings' | 'notifications'>('settings');

  // New Tax Rule Form
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleType, setNewRuleType] = useState<'GST' | 'TDS' | 'Cess'>('GST');
  const [newRuleRate, setNewRuleRate] = useState(18);
  const [newRuleSection, setNewRuleSection] = useState('SAC 9965');

  const handleAddTaxRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;
    const rule: TaxRule = {
      tax_rule_id: `tr-${Date.now()}`,
      rule_name: newRuleName,
      tax_type: newRuleType,
      rate_percentage: Number(newRuleRate),
      section_code: newRuleSection,
      effective_from: '2026-04-01',
      is_active: true
    };
    setTaxRules([...taxRules, rule]);
    setShowTaxModal(false);
    setNewRuleName('');
  };

  // 1. TAX & COMPLIANCE MODULE
  if (moduleType === 'tax') {
    const taxControls = (
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          onClick={() => setShowTaxModal(true)}
          className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Tax Rule</span>
        </button>
      </div>
    );

    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Content */}
        {taxTab === 'rules' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h3 className="font-bold text-slate-900 text-base">Active Tax Rules & Withholding Rates</h3>
              {taxControls}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Rule Name</th>
                    <th className="pb-3">Tax Type</th>
                    <th className="pb-3">Section / Code</th>
                    <th className="pb-3 text-right">Rate (%)</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {taxRules.map(tr => (
                    <tr key={tr.tax_rule_id} className="hover:bg-[#FAF7F3]/80">
                      <td className="py-3.5 font-bold text-slate-900 text-sm">{tr.rule_name}</td>
                      <td className="py-3.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">{tr.tax_type}</span></td>
                      <td className="py-3.5 font-mono text-slate-600">{tr.section_code || '-'}</td>
                      <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">{tr.rate_percentage}%</td>
                      <td className="py-3.5 text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {taxTab === 'gst' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">GSTR-1 & GSTR-3B Summary Feed</h3>
                <p className="text-xs text-slate-500">Automated calculation from vendor purchase bills and transport fees.</p>
              </div>
              {taxControls}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 flex flex-col justify-between h-full">
                <div className="text-slate-500 text-xs">Taxable Outward Supplies</div>
                <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">₹4,50,000</div>
              </div>
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 flex flex-col justify-between h-full">
                <div className="text-slate-500 text-xs">Input Tax Credit (ITC Available)</div>
                <div className="text-lg font-bold text-emerald-700 mt-1 tabular-nums">₹85,000</div>
              </div>
              <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 flex flex-col justify-between h-full">
                <div className="text-slate-500 text-xs">Net GST Payable</div>
                <div className="text-lg font-bold text-burgundy-800 mt-1">₹0 (School Exemption)</div>
              </div>
            </div>
          </div>
        )}

        {taxTab === 'tds' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">TDS Withholding Ledger (Sections 192, 194C & 194J)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Payroll salary deductions and contractor invoice tax withholdings · Total Deducted: <strong className="text-burgundy-700">₹32,500</strong></p>
              </div>
              {taxControls}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Deductee / Vendor</th>
                    <th className="pb-3">Section</th>
                    <th className="pb-3">PAN</th>
                    <th className="pb-3 text-right">Base Amount (₹)</th>
                    <th className="pb-3 text-right">TDS Deducted (₹)</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-bold text-slate-900">Faculty Payroll Batch (#RUN-2026-11)</td>
                    <td className="py-3.5 font-mono text-burgundy-700 font-semibold">192</td>
                    <td className="py-3.5 font-mono text-slate-500">AGGREGATE</td>
                    <td className="py-3.5 text-right font-medium tabular-nums">₹2,85,000</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">₹22,500</td>
                    <td className="py-3.5 text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Remitted</span></td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-bold text-slate-900">ABC School Supplies Ltd</td>
                    <td className="py-3.5 font-mono text-burgundy-700 font-semibold">194C</td>
                    <td className="py-3.5 font-mono text-slate-500">AABCA4512K</td>
                    <td className="py-3.5 text-right font-medium tabular-nums">₹1,00,000</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">₹2,000</td>
                    <td className="py-3.5 text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Due 7th Dec</span></td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-bold text-slate-900">Rao & Associates Chartered Accountants</td>
                    <td className="py-3.5 font-mono text-burgundy-700 font-semibold">194J</td>
                    <td className="py-3.5 font-mono text-slate-500">AAFFR8821M</td>
                    <td className="py-3.5 text-right font-medium tabular-nums">₹80,000</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">₹8,000</td>
                    <td className="py-3.5 text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Remitted</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {taxTab === 'challans' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h3 className="font-bold text-slate-900 text-base">Tax Deposit Challans</h3>
              {taxControls}
            </div>
            <div className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FAF7F3]">
              <div>
                <div className="font-bold text-slate-900">ITNS 281 Challan #TDS-OCT-2026</div>
                <div className="text-xs text-slate-500">TDS on Salaries (192) & Professional Fees (194J)</div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                <div className="text-sm font-bold text-slate-900 tabular-nums">₹32,500</div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">Deposited (CIN: 008129)</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showTaxModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl text-xs">
              <h3 className="text-base font-bold text-slate-900">Create Tax Rule</h3>
              <form onSubmit={handleAddTaxRule} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rule Name</label>
                  <input type="text" required value={newRuleName} onChange={e => setNewRuleName(e.target.value)} placeholder="e.g. TDS on Rent (194-I)" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg p-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Type</label>
                    <select value={newRuleType} onChange={e => setNewRuleType(e.target.value as any)} className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg p-2">
                      <option value="GST">GST</option>
                      <option value="TDS">TDS</option>
                      <option value="Cess">Cess</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Rate (%)</label>
                    <input type="number" value={newRuleRate} onChange={e => setNewRuleRate(Number(e.target.value))} className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg p-2" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-3">
                  <button type="button" onClick={() => setShowTaxModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-100">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#8B3552] text-white font-semibold">Save Rule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. BUDGETS & FUNDS MODULE
  if (moduleType === 'budgets') {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Annual Departmental Budget Utilisation (FY 2026-27)</h3>
          <div className="space-y-4">
            {budgets.map(b => {
              const utilPercent = Math.min(100, Math.round((b.spent_amount / b.allocated_amount) * 100));
              return (
                <div key={b.budget_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{b.category}</h4>
                      <p className="text-xs text-slate-500">Fiscal Period: {b.fiscal_year} | Branch: Chennai Main Campus</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                    <div>Allocated: <strong className="text-slate-900 font-bold tabular-nums">₹{b.allocated_amount.toLocaleString('en-IN')}</strong></div>
                    <div>Spent (Actual): <strong className="text-slate-900 font-bold tabular-nums">₹{b.spent_amount.toLocaleString('en-IN')}</strong></div>
                    <div>Remaining: <strong className="text-burgundy-700 font-bold tabular-nums">₹{(b.allocated_amount - b.spent_amount).toLocaleString('en-IN')}</strong></div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500">
                      <span>Utilisation Progress</span>
                      <span className="font-bold text-slate-800">{utilPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full ${utilPercent > 85 ? 'bg-amber-500' : 'bg-[#8B3552]'}`} style={{ width: `${utilPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. INVENTORY & FIXED ASSETS MODULE
  if (moduleType === 'inventory') {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base">Campus Fixed Assets Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Asset Code</th>
                  <th className="pb-3">Asset Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Purchase Date</th>
                  <th className="pb-3 text-right">Original Cost (₹)</th>
                  <th className="pb-3 text-right">Book Value (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assets.map(a => (
                  <tr key={a.asset_id} className="hover:bg-[#FAF7F3]/80">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{a.asset_code}</td>
                    <td className="py-3.5 font-bold text-slate-900 text-sm">{a.asset_name}</td>
                    <td className="py-3.5 text-slate-600">{a.category}</td>
                    <td className="py-3.5 text-slate-500">{a.purchase_date}</td>
                    <td className="py-3.5 text-right font-medium text-slate-700 tabular-nums">₹{a.purchase_value.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">₹{a.current_book_value.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. ADMINISTRATION & SETTINGS
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-base">Campus Operating Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs items-stretch">
          <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 h-full">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">Automated Payment Notifications</div>
              <p className="text-slate-500">Send instant SMS and Email notifications to parents upon receipt posting.</p>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">Enabled</span>
            </div>
          </div>
          <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 h-full">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">Maker-Checker Threshold</div>
              <p className="text-slate-500">Disbursements above ₹50,000 require second-level finance approval.</p>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200 whitespace-nowrap">₹50,000 Cap</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
