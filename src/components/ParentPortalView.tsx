import React, { useState } from 'react';
import { 
  GraduationCap, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Receipt, 
  FileText, 
  History, 
  User, 
  HelpCircle, 
  Download, 
  Home, 
  AlertCircle,
  Bell,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Student, FeeInvoice, FeePayment } from '../types';

interface ParentPortalViewProps {
  students: Student[];
  invoices: FeeInvoice[];
  payments: FeePayment[];
  currentTab?: string;
  onMakePayment?: (newPayment: FeePayment) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  invoices,
  payments,
  currentTab = 'parent_home',
  onMakePayment = () => {}
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.student_id || 'student-101');
  const [internalTab, setInternalTab] = useState<string>('parent_home');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<FeeInvoice | null>(null);

  // Help request state
  const [helpRequestType, setHelpRequestType] = useState('Fee Clarification');
  const [helpRequestText, setHelpRequestText] = useState('');
  const [helpRequestSuccess, setHelpRequestSuccess] = useState(false);

  const activeTab = currentTab || internalTab;

  const currentStudent = students.find(s => s.student_id === selectedStudentId) || students[0];
  const studentInvoices = invoices.filter(i => i.student_id === currentStudent?.student_id);
  const studentPayments = payments.filter(p => p.student_id === currentStudent?.student_id);

  const totalOutstanding = studentInvoices
    .filter(i => i.invoice_status !== 'Paid')
    .reduce((sum, i) => sum + i.net_amount, 0);

  const handleExecutePayment = () => {
    if (!selectedInvoiceForPay) return;

    const newPay: FeePayment = {
      fee_payment_id: `pay-${Date.now()}`,
      student_id: currentStudent.student_id,
      payment_amount: selectedInvoiceForPay.net_amount,
      payment_mode: 'Online / Gateway',
      payment_status: 'Success',
      payment_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      bank_account_id: 'bank-01',
      gateway_payment_id: `rzp_pay_${Date.now()}`,
      payment_reference: `UPI-${Math.floor(100000000 + Math.random() * 900000000)}`,
      allocated_invoices: [{ fee_invoice_id: selectedInvoiceForPay.fee_invoice_id, allocated_amount: selectedInvoiceForPay.net_amount }]
    };

    onMakePayment(newPay);
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setPaymentSuccess(false);
    }, 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* 1. HOME & FEE SUMMARY */}
      {(activeTab === 'parent_home' || activeTab === 'p_dashboard' || activeTab === 'p_fee_summary') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Student</div>
                <select 
                  aria-label="Select Child"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-[#FAF7F3] border border-champagne-200 rounded-lg px-2 py-1 text-slate-900 text-[11px] font-bold focus:outline-none cursor-pointer"
                >
                  {students.slice(0, 2).map(s => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.student_name} ({s.class_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">{currentStudent.student_name}</div>
              <div className="text-xs text-champagne-600 font-semibold mt-0.5">{currentStudent.class_id} - {currentStudent.section_id}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Outstanding Due</div>
              <div className="text-2xl font-black text-rose-600 mt-1 tabular-nums">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Due Date: 10 June 2026</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Paid (YTD)</div>
              <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                ₹{studentPayments.reduce((s, p) => s + p.payment_amount, 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-0.5">Verified online receipts</div>
            </div>
          </div>

          {/* Quick Pay Prompt */}
          {totalOutstanding > 0 && (
            <div className="p-5 rounded-2xl bg-champagne-50 border border-champagne-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="font-bold text-champagne-950 text-sm">Upcoming Term Fee Due for {currentStudent.student_name}</div>
                <p className="text-xs text-champagne-700 font-medium mt-0.5">Pay online via UPI, Debit/Credit Card, or Netbanking with 0% gateway surcharge.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedInvoiceForPay(studentInvoices[0] || null);
                  setShowCheckoutModal(true);
                }}
                className="px-5 py-2.5 bg-champagne-600 hover:bg-champagne-700 text-white font-bold rounded-xl text-xs shadow-xs transition shrink-0"
              >
                Pay Now (₹{totalOutstanding.toLocaleString('en-IN')})
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. MY CHILDREN */}
      {(activeTab === 'parent_children' || activeTab.startsWith('p_child_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Linked Children Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.slice(0, 2).map(s => (
              <div key={s.student_id} className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{s.student_name}</h4>
                    <p className="text-xs text-slate-500 font-mono">Admission #: {s.admission_number}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {s.student_status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
                  <div>Class & Section: <strong className="text-slate-900">{s.class_id} - {s.section_id}</strong></div>
                  <div>Campus: <strong className="text-slate-900">Chennai Main Campus</strong></div>
                  <div>Admitted Date: <strong className="text-slate-900">{s.admission_date}</strong></div>
                  <div>Academic Year: <strong className="text-burgundy-700 font-bold">2026-27</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FEE DETAILS & HEADS */}
      {(activeTab === 'parent_fee_details' || activeTab.startsWith('p_fee_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Term Fee Structure & Invoices for {currentStudent.student_name}</h3>
              <p className="text-xs text-slate-500 font-medium">Detailed breakdown of tuition, lab, transport and activity fees</p>
            </div>
            <select 
              aria-label="Select Child"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-[#FAF7F3] border border-champagne-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none cursor-pointer shrink-0"
            >
              {students.slice(0, 2).map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_name} ({s.class_id})
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Invoice Date</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3 text-right">Gross (₹)</th>
                  <th className="pb-3 text-right">Net Payable (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {studentInvoices.map(inv => (
                  <tr key={inv.fee_invoice_id} className="hover:bg-[#FAF7F3]">
                    <td className="py-3.5 font-bold text-champagne-700 font-mono">{inv.invoice_number}</td>
                    <td className="py-3.5 text-slate-600">{inv.invoice_date}</td>
                    <td className="py-3.5 text-slate-600">{inv.due_date}</td>
                    <td className="py-3.5 text-right font-medium tabular-nums">₹{inv.gross_amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-right font-black text-slate-900 tabular-nums">₹{inv.net_amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {inv.invoice_status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {inv.invoice_status !== 'Paid' && (
                        <button
                          onClick={() => {
                            setSelectedInvoiceForPay(inv);
                            setShowCheckoutModal(true);
                          }}
                          className="px-3 py-1 bg-champagne-600 hover:bg-champagne-700 text-white font-bold rounded-lg text-xs"
                        >
                          Pay Online
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PAY FEES ONLINE */}
      {(activeTab === 'parent_pay_fees' || activeTab.startsWith('p_select_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Online Fee Payment Gateway</h3>
              <p className="text-xs text-slate-500 font-medium">Select pending invoice and complete checkout using UPI, Netbanking, or Debit Card</p>
            </div>
            <select 
              aria-label="Select Child"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-[#FAF7F3] border border-champagne-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none cursor-pointer shrink-0"
            >
              {students.slice(0, 2).map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_name} ({s.class_id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {studentInvoices.filter(i => i.invoice_status !== 'Paid').map(inv => (
              <div key={inv.fee_invoice_id} className="p-5 rounded-xl border border-slate-200 bg-[#FAF7F3] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="font-bold text-slate-900">{inv.invoice_number} - Standard Term 1 Fees</div>
                  <div className="text-xs text-slate-500 mt-0.5">Due: {inv.due_date} | Student: {currentStudent.student_name}</div>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-lg font-black text-slate-900 tabular-nums">₹{inv.net_amount.toLocaleString('en-IN')}</div>
                  <button
                    onClick={() => {
                      setSelectedInvoiceForPay(inv);
                      setShowCheckoutModal(true);
                    }}
                    className="mt-1 px-4 py-1.5 bg-champagne-600 hover:bg-champagne-700 text-white font-bold rounded-lg text-xs shadow-xs whitespace-nowrap"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            ))}

            {studentInvoices.filter(i => i.invoice_status !== 'Paid').length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-[#FAF7F3] rounded-xl">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <div className="font-bold text-slate-800">All fees for {currentStudent.student_name} are up-to-date!</div>
                <p className="text-xs text-slate-500 mt-1">No pending invoices found for payment.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PAYMENT HISTORY */}
      {(activeTab === 'parent_payment_history' || activeTab.startsWith('p_success_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base">Payment Transaction Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3">Transaction Date</th>
                  <th className="pb-3">Reference / Txn ID</th>
                  <th className="pb-3">Payment Mode</th>
                  <th className="pb-3 text-right">Amount (₹)</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {studentPayments.map(p => (
                  <tr key={p.fee_payment_id} className="hover:bg-[#FAF7F3]">
                    <td className="py-3.5 text-slate-500">{p.payment_date}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-900">{p.payment_reference}</td>
                    <td className="py-3.5 text-slate-600">{p.payment_mode}</td>
                    <td className="py-3.5 text-right font-bold text-slate-900 tabular-nums">₹{p.payment_amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. RECEIPTS */}
      {(activeTab === 'parent_receipts' || activeTab.startsWith('p_receipt_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base">Official Digital Fee Receipts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentPayments.map(p => (
              <div key={p.fee_payment_id} className="p-5 rounded-xl border border-slate-200 bg-[#FAF7F3] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Receipt #REC-{p.fee_payment_id.slice(-4)}</h4>
                    <p className="text-xs text-slate-500 font-mono">Ref: {p.payment_reference}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Issued
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <div className="flex justify-between"><span>Student:</span> <strong className="text-slate-900">{currentStudent.student_name}</strong></div>
                  <div className="flex justify-between"><span>Date:</span> <strong className="text-slate-900">{p.payment_date}</strong></div>
                  <div className="flex justify-between"><span>Amount Paid:</span> <strong className="text-emerald-700 font-bold tabular-nums">₹{p.payment_amount.toLocaleString('en-IN')}</strong></div>
                </div>
                <button
                  onClick={() => alert(`Official Receipt PDF downloaded for ${p.payment_reference}`)}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-champagne-700 border border-champagne-200 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PROFILE */}
      {(activeTab === 'parent_profile' || activeTab.startsWith('p_guardian_')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Guardian Profile & Contact Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Guardian Information</div>
              <div>Name: <strong className="text-slate-900">Meena Kumar</strong></div>
              <div>Email: <strong className="text-slate-900">parent.meena@gmail.com</strong></div>
              <div>Mobile: <strong className="text-slate-900">+91 98400 99887</strong></div>
              <div>Portal Status: <span className="text-emerald-700 font-bold">Active & Verified</span></div>
            </div>
            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Notification Channels</div>
              <div>WhatsApp Fee Alerts: <strong className="text-emerald-700">Enabled</strong></div>
              <div>Email Statements: <strong className="text-emerald-700">Monthly PDF Enabled</strong></div>
              <div>SMS Receipts: <strong className="text-emerald-700">Instant</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* 8. HELP & REQUESTS */}
      {(activeTab === 'parent_help' || activeTab.startsWith('p_fee_clarification')) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Submit Fee Query or Concession Request</h3>
            <p className="text-xs text-slate-500 font-medium">Messages are directly routed to the School Finance Officer</p>
          </div>

          {helpRequestSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your request has been submitted. Reference ticket #TKT-8891 assigned.</span>
            </div>
          )}

          <div className="p-5 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Request Type</label>
              <select
                value={helpRequestType}
                onChange={e => setHelpRequestType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
              >
                <option value="Fee Clarification">Fee Clarification / Head Inquiry</option>
                <option value="Concession Request">Sibling / Merit Concession Request</option>
                <option value="Refund Inquiry">Refund / Excess Payment Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Message / Details</label>
              <textarea
                rows={3}
                value={helpRequestText}
                onChange={e => setHelpRequestText(e.target.value)}
                placeholder="Please describe your query regarding fees or installment options..."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900"
              />
            </div>
            <button
              onClick={() => {
                if (!helpRequestText.trim()) return;
                setHelpRequestSuccess(true);
                setHelpRequestText('');
              }}
              className="px-4 py-2 bg-champagne-600 hover:bg-champagne-700 text-white font-bold rounded-lg text-xs shadow-xs"
            >
              Submit Query
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL (PAY ONLINE) */}
      {showCheckoutModal && selectedInvoiceForPay && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">Online Fee Checkout</h3>
                <p className="text-xs text-slate-500 font-medium">Invoice: {selectedInvoiceForPay.invoice_number}</p>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500">Official receipt generated and sent to registered parent email.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between"><span className="text-slate-500">Student:</span> <strong className="text-slate-900">{currentStudent.student_name}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">Net Payable:</span> <strong className="text-xl font-black text-champagne-700 tabular-nums">₹{selectedInvoiceForPay.net_amount.toLocaleString('en-IN')}</strong></div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR' },
                      { id: 'card', label: 'Debit Card' },
                      { id: 'netbanking', label: 'Netbanking' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-2 rounded-xl border text-xs font-bold transition ${
                          paymentMethod === m.id
                            ? 'bg-champagne-600 text-white border-champagne-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FAF7F3]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleExecutePayment}
                    className="w-full py-3 bg-champagne-600 hover:bg-champagne-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                  >
                    Confirm & Pay ₹{selectedInvoiceForPay.net_amount.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
