import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AccountGroup, Ledger, CostCentre, AccountingVoucher } from '../types';

interface AccountingViewProps {
  accountGroups: AccountGroup[];
  ledgers: Ledger[];
  costCentres: CostCentre[];
  vouchers: AccountingVoucher[];
  onAddVoucher: (voucher: AccountingVoucher) => void;
  initialTab?: 'ledgers' | 'groups' | 'cost_centres' | 'vouchers';
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  accountGroups,
  ledgers,
  costCentres,
  vouchers,
  onAddVoucher,
  initialTab = 'vouchers'
}) => {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'groups' | 'cost_centres' | 'vouchers'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [voucherType, setVoucherType] = useState<'Receipt' | 'Payment' | 'Journal'>('Receipt');
  const [voucherNumber, setVoucherNumber] = useState('RV-2026-0015');
  const [voucherDate, setVoucherDate] = useState('2026-11-16');
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState([
    { voucher_line_id: 'l-1', ledger_id: ledgers[0]?.ledger_id || '', line_number: 1, debit_amount: 50000, credit_amount: 0 },
    { voucher_line_id: 'l-2', ledger_id: ledgers[2]?.ledger_id || '', line_number: 2, debit_amount: 0, credit_amount: 50000 }
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + (Number(l.debit_amount) || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (Number(l.credit_amount) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleCreateVoucher = () => {
    if (!isBalanced) return;
    const newVouch: AccountingVoucher = {
      voucher_id: `vouch-${Date.now()}`,
      voucher_type_id: voucherType,
      voucher_number: voucherNumber,
      voucher_date: voucherDate,
      company_id: 'comp-001',
      branch_id: 'branch-01',
      financial_year_id: 'fy-2026-27',
      narration: narration || 'Standard financial accounting entry',
      source_module: 'MANUAL',
      status: 'Posted',
      is_posted: true,
      total_debit: totalDebit,
      total_credit: totalCredit,
      lines: lines.map((l, idx) => ({ ...l, line_number: idx + 1 })),
      created_by: 'Kavitha Ranganathan',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onAddVoucher(newVouch);
    setShowVoucherModal(false);
    setNarration('');
  };

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <button
        onClick={() => {
          if (activeTab === 'vouchers') setShowVoucherModal(true);
          else if (activeTab === 'ledgers') alert('Opening New Ledger Creation Form...');
          else if (activeTab === 'groups') alert('Opening Account Group Creator...');
          else if (activeTab === 'cost_centres') alert('Opening Cost Centre Creator...');
        }}
        className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>
          {activeTab === 'vouchers' && 'Create New Voucher'}
          {activeTab === 'ledgers' && 'Add New Ledger'}
          {activeTab === 'groups' && 'Add Account Group'}
          {activeTab === 'cost_centres' && 'Add Cost Centre'}
        </span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Verified Accounting Vouchers (Day Book)</h3>
              <span className="text-xs text-emerald-700 font-bold">All posted vouchers strictly balance (Debit = Credit)</span>
            </div>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Voucher #</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Narration</th>
                  <th className="pb-3 text-right">Debit (₹)</th>
                  <th className="pb-3 text-right">Credit (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vouchers.map(v => (
                  <tr key={v.voucher_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{v.voucher_number}</td>
                    <td className="py-3.5 font-bold text-slate-800">{v.voucher_type_id}</td>
                    <td className="py-3.5 text-slate-500 font-medium">{v.voucher_date}</td>
                    <td className="py-3.5 text-slate-700 truncate max-w-xs">{v.narration}</td>
                    <td className="py-3.5 text-right font-black text-slate-900 tabular-nums">₹{v.total_debit.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-right font-black text-slate-900 tabular-nums">₹{v.total_credit.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ledgers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Chart of Accounts (Ledgers)</h3>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Ledger Code</th>
                  <th className="pb-3">Ledger Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Opening Balance (₹)</th>
                  <th className="pb-3 text-center">Control Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ledgers.map(l => (
                  <tr key={l.ledger_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-3.5 font-mono text-burgundy-700 font-bold">{l.ledger_code}</td>
                    <td className="py-3.5 font-bold text-slate-900 text-sm">{l.ledger_name}</td>
                    <td className="py-3.5 text-slate-600 font-medium">{l.ledger_type}</td>
                    <td className="py-3.5 text-right font-black text-slate-900 tabular-nums">
                      ₹{l.opening_balance.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400">{l.opening_balance_side}</span>
                    </td>
                    <td className="py-3.5 text-center">
                      {l.is_system_control_ledger ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-burgundy-50 text-burgundy-700 font-bold text-[10px] border border-burgundy-200">System Control</span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Account Groups Hierarchy</h3>
            {sectionControls}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountGroups.map(g => (
              <div key={g.group_id} className="p-4 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{g.group_name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">{g.group_code}</span>
                </div>
                <div className="text-xs text-slate-600 flex justify-between pt-2 border-t border-slate-200 font-medium">
                  <span>Nature: <strong className="text-slate-900">{g.account_nature}</strong></span>
                  <span>Statement: <strong className="text-slate-900">{g.statement_class}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cost_centres' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Cost Centres & Allocations</h3>
            {sectionControls}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costCentres.map(cc => (
              <div key={cc.cost_centre_id} className="p-4 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{cc.cost_centre_name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">{cc.cost_centre_code}</span>
                </div>
                <div className="text-xs text-slate-600 pt-2 border-t border-slate-200 font-medium">
                  Category: <strong className="text-slate-900">{cc.category_name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showVoucherModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Create Accounting Voucher (Double Entry)</h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Voucher Type</label>
                <select 
                  value={voucherType}
                  onChange={(e) => setVoucherType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600"
                >
                  <option value="Receipt">Receipt</option>
                  <option value="Payment">Payment</option>
                  <option value="Journal">Journal</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Voucher Number</label>
                <input 
                  type="text" 
                  value={voucherNumber}
                  onChange={(e) => setVoucherNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-burgundy-600" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Voucher Date</label>
                <input 
                  type="date" 
                  value={voucherDate}
                  onChange={(e) => setVoucherDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600" 
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Narration / Description</label>
              <textarea 
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="Enter transaction narrative..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium h-20 focus:outline-none focus:border-burgundy-600"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-xs">Debit / Credit Line Items</span>
                <button 
                  onClick={() => setLines([...lines, { voucher_line_id: `l-${Date.now()}`, ledger_id: ledgers[0]?.ledger_id || '', line_number: lines.length + 1, debit_amount: 0, credit_amount: 0 }])}
                  className="text-burgundy-700 hover:underline font-bold text-xs"
                >
                  + Add Line
                </button>
              </div>

              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div key={line.voucher_line_id} className="grid grid-cols-12 gap-2 items-center bg-[#FAF7F3] p-3 rounded-xl border border-slate-200">
                    <div className="col-span-5">
                      <select 
                        value={line.ledger_id}
                        onChange={(e) => {
                          const updated = [...lines];
                          updated[idx].ledger_id = e.target.value;
                          setLines(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-semibold"
                      >
                        {ledgers.map(l => (
                          <option key={l.ledger_id} value={l.ledger_id}>{l.ledger_name} ({l.ledger_type})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        placeholder="Debit (₹)" 
                        value={line.debit_amount || ''}
                        onChange={(e) => {
                          const updated = [...lines];
                          updated[idx].debit_amount = Number(e.target.value);
                          if (Number(e.target.value) > 0) updated[idx].credit_amount = 0;
                          setLines(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold text-right"
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        placeholder="Credit (₹)" 
                        value={line.credit_amount || ''}
                        onChange={(e) => {
                          const updated = [...lines];
                          updated[idx].credit_amount = Number(e.target.value);
                          if (Number(e.target.value) > 0) updated[idx].debit_amount = 0;
                          setLines(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold text-right"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {lines.length > 2 && (
                        <button 
                          onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-700 font-extrabold text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-3 rounded-xl flex items-center justify-between border ${
                isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {isBalanced ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span className="font-bold">
                    {isBalanced ? 'Voucher is balanced and ready to post' : `Difference of ₹${Math.abs(totalDebit - totalCredit).toLocaleString('en-IN')} (Debits must equal Credits)`}
                  </span>
                </div>
                <div className="text-right font-black tabular-nums">
                  Debit: ₹{totalDebit.toLocaleString('en-IN')} | Credit: ₹{totalCredit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateVoucher}
                disabled={!isBalanced}
                className={`px-4 py-2 rounded-xl font-bold transition shadow-xs ${
                  isBalanced ? 'bg-[#8B3552] hover:bg-[#722B43] text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                Post Voucher
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
