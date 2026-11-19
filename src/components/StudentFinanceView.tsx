import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle, Percent, RotateCcw } from 'lucide-react';
import { Student, Guardian, FeePlan, FeeInvoice, FeePayment } from '../types';

interface StudentFinanceViewProps {
  students: Student[];
  guardians: Guardian[];
  feePlans: FeePlan[];
  invoices: FeeInvoice[];
  payments: FeePayment[];
  initialTab?: 'students' | 'invoices' | 'payments' | 'plans' | 'refunds';
}

export const StudentFinanceView: React.FC<StudentFinanceViewProps> = ({
  students,
  feePlans,
  invoices,
  payments,
  initialTab = 'invoices'
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'invoices' | 'payments' | 'plans' | 'refunds'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Mock Refunds & Concessions
  const [refunds, setRefunds] = useState([
    {
      refund_id: 'REF-2026-001',
      student_name: 'Aadhavan K (ADM-2026-001)',
      reason: 'Caution Deposit Return on Grade 12 Graduation',
      amount: 10000,
      request_date: '2026-11-10',
      status: 'Approved',
      disbursement_mode: 'Bank Transfer'
    },
    {
      refund_id: 'REF-2026-002',
      student_name: 'Harini Sundaram (ADM-2026-002)',
      reason: 'Excess Term 1 Bus Transport Fee Overpayment',
      amount: 3500,
      request_date: '2026-11-14',
      status: 'Pending',
      disbursement_mode: 'Cheque'
    }
  ]);

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <select
        aria-label="Student Finance Section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as 'students' | 'plans' | 'invoices' | 'payments' | 'refunds')}
        className="bg-[#FAF7F3] border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer"
      >
        <option value="invoices">Fee Invoices ({invoices.length})</option>
        <option value="students">Students & Guardians ({students.length})</option>
        <option value="payments">Collections & Receipts ({payments.length})</option>
        <option value="plans">Fee Plans & Heads ({feePlans.length})</option>
        <option value="refunds">Concessions & Refunds ({refunds.length})</option>
      </select>
      <button
        onClick={() => {
          if (activeTab === 'invoices') setShowInvoiceModal(true);
          else if (activeTab === 'students') alert('Opening Student Admission Form...');
          else if (activeTab === 'payments') alert('Opening Fee Collection Receipt Form...');
          else if (activeTab === 'plans') alert('Opening Fee Plan Creator...');
          else if (activeTab === 'refunds') alert('Opening Refund Request Form...');
        }}
        className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>
          {activeTab === 'invoices' && 'Generate Fee Invoice'}
          {activeTab === 'students' && 'Add Student Admission'}
          {activeTab === 'payments' && 'Record Fee Collection'}
          {activeTab === 'plans' && 'Create Fee Plan'}
          {activeTab === 'refunds' && 'Request Refund'}
        </span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Student Fee Invoices & Outstanding Dues</h3>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Invoice Date</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3 text-right">Gross (₹)</th>
                  <th className="pb-3 text-right">Net Payable (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map(inv => {
                  const student = students.find(s => s.student_id === inv.student_id);
                  return (
                    <tr key={inv.fee_invoice_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-burgundy-700">{inv.invoice_number}</td>
                      <td className="py-3.5 font-bold text-slate-900">
                        {student?.student_name} <span className="text-[10px] text-slate-400 font-mono">({student?.admission_number})</span>
                      </td>
                      <td className="py-3.5 text-slate-500 font-medium">{inv.invoice_date}</td>
                      <td className="py-3.5 text-slate-500 font-medium">{inv.due_date}</td>
                      <td className="py-3.5 text-right font-medium tabular-nums">₹{inv.gross_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-right font-black text-slate-900 text-sm tabular-nums">₹{inv.net_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.invoice_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.invoice_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Enrolled Students Roster</h3>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Admission #</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class & Section</th>
                  <th className="pb-3">Admission Date</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map(s => (
                  <tr key={s.student_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{s.admission_number}</td>
                    <td className="py-3.5 font-bold text-slate-900 text-sm">{s.student_name}</td>
                    <td className="py-3.5 font-medium text-slate-700">{s.class_id} - Section {s.section_id}</td>
                    <td className="py-3.5 text-slate-500 font-medium">{s.admission_date}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.student_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Fee Receipts & Payment Transactions</h3>
            {sectionControls}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Receipt / Payment ID</th>
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Payment Mode</th>
                  <th className="pb-3">Date / Time</th>
                  <th className="pb-3 text-right">Amount (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map(p => {
                  const student = students.find(s => s.student_id === p.student_id);
                  return (
                    <tr key={p.fee_payment_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-burgundy-700">{p.fee_payment_id}</td>
                      <td className="py-3.5 font-bold text-slate-900">{student?.student_name}</td>
                      <td className="py-3.5 font-medium text-slate-700">{p.payment_mode}</td>
                      <td className="py-3.5 text-slate-500 font-medium">{p.payment_date}</td>
                      <td className="py-3.5 text-right font-black text-slate-900 text-sm tabular-nums">₹{p.payment_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Fee Plans & Structure</h3>
            {sectionControls}
          </div>
          <div className="space-y-4">
            {feePlans.map(fp => (
              <div key={fp.fee_plan_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{fp.plan_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Class: {fp.class_id} | Academic Year: {fp.academic_year_id}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                    {fp.plan_status}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {fp.lines.map((l, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-0.5">
                      <div className="text-slate-400 font-semibold">Head ID: {l.fee_head_id}</div>
                      <div className="text-slate-900 font-black text-sm mt-0.5 tabular-nums">₹{l.amount.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">({l.billing_frequency})</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refunds & Concessions Tab */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Fee Concessions & Refund Vouchers</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Manage merit scholarships, sibling discounts, and student security deposit refunds</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="pb-3">Refund ID</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Reason / Details</th>
                  <th className="pb-3">Disbursement Mode</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {refunds.map(r => (
                  <tr key={r.refund_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-burgundy-700">{r.refund_id}</td>
                    <td className="py-3.5 font-bold text-slate-900">{r.student_name}</td>
                    <td className="py-3.5 text-slate-600 font-medium">{r.reason}</td>
                    <td className="py-3.5 text-slate-500">{r.disbursement_mode}</td>
                    <td className="py-3.5 text-slate-500 font-medium">{r.request_date}</td>
                    <td className="py-3.5 text-right font-black text-slate-900 text-sm tabular-nums">₹{r.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl text-xs">
            <h3 className="text-base font-extrabold text-slate-900">Generate Student Fee Invoice</h3>
            <p className="text-slate-500 font-medium">Select student and fee plan to raise an official fee demand invoice.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Student</label>
                <select className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600">
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id}>{s.student_name} ({s.admission_number}) - {s.class_id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fee Plan</label>
                <select className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600">
                  {feePlans.map(fp => (
                    <option key={fp.fee_plan_id} value={fp.fee_plan_id}>{fp.plan_name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Invoice Date</label>
                  <input type="date" defaultValue="2026-11-16" className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input type="date" defaultValue="2026-12-15" className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none focus:border-burgundy-600" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-2 rounded-xl bg-[#8B3552] text-white hover:bg-[#722B43] font-bold shadow-xs"
              >
                Issue Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
