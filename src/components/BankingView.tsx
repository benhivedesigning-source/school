import React, { useState } from 'react';
import { Wallet, CreditCard, CheckCircle2 } from 'lucide-react';
import { BankAccount, PaymentGateway, BankStatement, AccountingVoucher } from '../types';

interface BankingViewProps {
  bankAccounts: BankAccount[];
  gateways: PaymentGateway[];
  statements: BankStatement[];
  vouchers: AccountingVoucher[];
  initialTab?: 'accounts' | 'book' | 'reconciliation' | 'gateways';
}

export const BankingView: React.FC<BankingViewProps> = ({
  bankAccounts,
  gateways,
  statements,
  initialTab = 'reconciliation'
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'book' | 'reconciliation' | 'gateways'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [selectedStmt] = useState(statements[0]);
  const [reconciliationStatus, setReconciliationStatus] = useState<'InProgress' | 'Approved'>('InProgress');

  const sectionControls = (
    <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shadow-2xs whitespace-nowrap shrink-0">
      Status: Bank Book Synced
    </span>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="flex flex-col justify-between">
              <div className="text-slate-400 font-semibold">Selected Bank Account</div>
              <div className="text-slate-900 font-bold text-sm mt-1">State Bank of India (A/c ending 4521)</div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-slate-400 font-semibold">Statement Period</div>
              <div className="text-slate-900 font-bold text-sm mt-1 tabular-nums">{selectedStmt.statement_from_date} to {selectedStmt.statement_to_date}</div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-slate-400 font-semibold">Book Balance vs Statement</div>
              <div className="text-emerald-700 font-bold text-sm mt-1 tabular-nums">₹4,635,000 Matches Statement</div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-slate-400 font-semibold">Reconciliation Status</div>
              <div className="mt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  {reconciliationStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h3 className="text-base font-bold text-slate-900">Imported Bank Statement Lines vs ERP Bank Book Entries</h3>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {sectionControls}
                <button 
                  onClick={() => setReconciliationStatus('Approved')}
                  className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Approve Reconciliation Period</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Bank Statement Description</th>
                    <th className="pb-3">Reference / UTR</th>
                    <th className="pb-3 text-right">Debit (₹)</th>
                    <th className="pb-3 text-right">Credit (₹)</th>
                    <th className="pb-3 text-center">Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedStmt.lines.map(line => (
                    <tr key={line.statement_line_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                      <td className="py-3.5 text-slate-500 font-medium">{line.transaction_date}</td>
                      <td className="py-3.5 font-bold text-slate-900 text-xs sm:text-sm">{line.description}</td>
                      <td className="py-3.5 font-mono text-burgundy-700 font-bold">{line.reference_number}</td>
                      <td className="py-3.5 text-right font-bold text-rose-600 tabular-nums">
                        {line.debit_amount > 0 ? `₹${line.debit_amount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="py-3.5 text-right font-bold text-emerald-700 tabular-nums">
                        {line.credit_amount > 0 ? `₹${line.credit_amount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Exact Match (Verified)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Registered School Bank Accounts</h3>
            {sectionControls}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map(ba => (
              <div key={ba.bank_account_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 border border-burgundy-100">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{ba.bank_name}</h4>
                      <p className="text-xs text-slate-500">{ba.account_nickname}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {ba.account_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
                  <div>Account No: <span className="font-mono text-slate-900 font-bold">****{ba.account_number_last4}</span></div>
                  <div>IFSC Code: <span className="font-mono text-slate-900 font-bold">{ba.ifsc_code}</span></div>
                  <div>Account Type: <span className="text-slate-900 font-bold">{ba.account_type}</span></div>
                  <div>Opening Balance: <span className="font-bold text-emerald-700 tabular-nums">₹{ba.opening_book_balance.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Bank Book Ledger (State Bank of India - Chennai Main)</h3>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Voucher #</th>
                  <th className="pb-3">Narration / Particulars</th>
                  <th className="pb-3 text-right">Debit (₹)</th>
                  <th className="pb-3 text-right">Credit (₹)</th>
                  <th className="pb-3 text-right">Running Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-[#FAF7F3]/80 transition-colors">
                  <td className="py-3.5 text-slate-500 font-medium">2026-04-01</td>
                  <td className="py-3.5 font-mono text-burgundy-700 font-bold">OPENING</td>
                  <td className="py-3.5 font-bold text-slate-900">Opening Balance brought forward</td>
                  <td className="py-3.5 text-right">-</td>
                  <td className="py-3.5 text-right">-</td>
                  <td className="py-3.5 text-right font-black text-emerald-700 tabular-nums">₹4,500,000</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition-colors">
                  <td className="py-3.5 text-slate-500 font-medium">2026-11-14</td>
                  <td className="py-3.5 font-mono text-burgundy-700 font-bold">RV-2026-0012</td>
                  <td className="py-3.5 font-bold text-slate-900">Razorpay Settlement Payout Ref: RZP-SET-881</td>
                  <td className="py-3.5 text-right font-bold text-emerald-700 tabular-nums">₹250,000</td>
                  <td className="py-3.5 text-right">-</td>
                  <td className="py-3.5 text-right font-black text-emerald-700 tabular-nums">₹4,750,000</td>
                </tr>
                <tr className="hover:bg-[#FAF7F3]/80 transition-colors">
                  <td className="py-3.5 text-slate-500 font-medium">2026-11-15</td>
                  <td className="py-3.5 font-mono text-burgundy-700 font-bold">PV-2026-0045</td>
                  <td className="py-3.5 font-bold text-slate-900">TNEB Electricity Bill Payment</td>
                  <td className="py-3.5 text-right">-</td>
                  <td className="py-3.5 text-right font-bold text-rose-600 tabular-nums">₹115,000</td>
                  <td className="py-3.5 text-right font-black text-emerald-700 tabular-nums">₹4,635,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'gateways' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Payment Gateways & Settlement Batches</h3>
            {sectionControls}
          </div>
          <div className="space-y-4">
            {gateways.map(gw => (
              <div key={gw.gateway_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-burgundy-50 text-burgundy-700 border border-burgundy-100">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{gw.gateway_name}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {gw.gateway_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
                  <div>Merchant ID: <span className="font-mono text-slate-900 font-bold">{gw.merchant_account_id}</span></div>
                  <div>Clearing Ledger: <span className="text-burgundy-700 font-bold">Razorpay Clearing</span></div>
                  <div>Settlement Bank: <span className="text-slate-900 font-bold">State Bank of India</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
