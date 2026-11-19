import React, { useState } from 'react';
import { Plus, Building2, CheckCircle2, ShoppingCart, CreditCard, Clock, Eye } from 'lucide-react';
import { Vendor, VendorBill } from '../types';

interface ProcurementViewProps {
  vendors: Vendor[];
  vendorBills: VendorBill[];
}

export const ProcurementView: React.FC<ProcurementViewProps> = ({
  vendors,
  vendorBills
}) => {
  const [activeTab, setActiveTab] = useState<'bills' | 'pos' | 'payments' | 'vendors'>('bills');
  const [showModal, setShowModal] = useState(false);
  const [showPoModal, setShowPoModal] = useState(false);

  // Mock Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      po_id: 'PO-2026-0089',
      vendor_name: 'ABC School Supplies Ltd',
      request_date: '2026-11-01',
      items: 'Physics & Chemistry Laboratory Consumables',
      total_amount: 100000,
      status: 'Approved',
      requested_by: 'Science Dept Head'
    },
    {
      po_id: 'PO-2026-0090',
      vendor_name: 'FastNet Broadband Solutions',
      request_date: '2026-11-05',
      items: 'Dedicated 500Mbps Leased Line Internet Renewal',
      total_amount: 45000,
      status: 'Fulfilled',
      requested_by: 'IT Administrator'
    },
    {
      po_id: 'PO-2026-0091',
      vendor_name: 'Premier Campus Transport Fleet',
      request_date: '2026-11-12',
      items: 'Bus Fleet Winter Servicing & Spare Tyres',
      total_amount: 185000,
      status: 'Pending Review',
      requested_by: 'Transport Manager'
    }
  ]);

  // Mock Vendor Payments / Disbursements
  const [vendorPayments, setVendorPayments] = useState([
    {
      payment_id: 'VP-2026-0412',
      vendor_name: 'FastNet Broadband Solutions',
      bill_ref: 'INV/2026/045',
      payment_date: '2026-11-08',
      amount: 45000,
      payment_mode: 'NEFT / RTGS',
      bank_account: 'SBI - Chennai Main (4521)',
      status: 'Disbursed'
    },
    {
      payment_id: 'VP-2026-0413',
      vendor_name: 'TNEB Electricity Board',
      bill_ref: 'BILL-EB-NOV-991',
      payment_date: '2026-11-15',
      amount: 115000,
      payment_mode: 'NetBanking Portal',
      bank_account: 'SBI - Chennai Main (4521)',
      status: 'Disbursed'
    }
  ]);

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <select
        aria-label="Procurement Section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as 'vendors' | 'pos' | 'bills' | 'payments')}
        className="bg-[#FAF7F3] border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer"
      >
        <option value="bills">Vendor Bills & Payables ({vendorBills.length})</option>
        <option value="pos">Purchase Requests & Orders ({purchaseOrders.length})</option>
        <option value="payments">Disbursements & Payments ({vendorPayments.length})</option>
        <option value="vendors">Vendor Directory ({vendors.length})</option>
      </select>
      {activeTab === 'pos' && (
        <button
          onClick={() => setShowPoModal(true)}
          className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span>Create Purchase Order</span>
        </button>
      )}
      {activeTab === 'bills' && (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Record Vendor Bill</span>
        </button>
      )}
      {activeTab === 'vendors' && (
        <button
          onClick={() => alert('Opening New Vendor Registration Form...')}
          className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Vendor</span>
        </button>
      )}
      {activeTab === 'payments' && (
        <button
          onClick={() => alert('Opening Payment Disbursement Form...')}
          className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Record Payment</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Bills Tab */}
      {activeTab === 'bills' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Supplier Bills & Outstanding Payables</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Verified bills awaiting treasury disbursement</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Supplier Invoice #</th>
                  <th className="pb-3.5">Vendor Name</th>
                  <th className="pb-3.5">Invoice Date</th>
                  <th className="pb-3.5">Due Date</th>
                  <th className="pb-3.5 text-right">Taxable (₹)</th>
                  <th className="pb-3.5 text-right">Gross Amount (₹)</th>
                  <th className="pb-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendorBills.map(vb => {
                  const vendor = vendors.find(v => v.vendor_id === vb.vendor_id);
                  return (
                    <tr key={vb.vendor_bill_id} className="hover:bg-[#FAF7F3]/80 transition">
                      <td className="py-4 font-mono font-semibold text-burgundy-700">{vb.supplier_invoice_number}</td>
                      <td className="py-4 font-bold text-slate-900 text-sm">{vendor?.vendor_name}</td>
                      <td className="py-4 text-slate-500 font-medium">{vb.supplier_invoice_date}</td>
                      <td className="py-4 text-slate-500 font-medium">{vb.due_date}</td>
                      <td className="py-4 text-right font-medium text-slate-700 tabular-nums">₹{vb.taxable_amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-right font-bold text-slate-900 text-sm tabular-nums">₹{vb.gross_amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {vb.status}
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

      {/* Purchase Orders Tab */}
      {activeTab === 'pos' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Purchase Requests & Purchase Orders</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Campus departmental requisition workflow and vendor PO issuance</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">PO Number</th>
                  <th className="pb-3.5">Vendor</th>
                  <th className="pb-3.5">Requisition Details</th>
                  <th className="pb-3.5">Requested Date</th>
                  <th className="pb-3.5 text-right">Order Value (₹)</th>
                  <th className="pb-3.5 text-center">Workflow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {purchaseOrders.map(po => (
                  <tr key={po.po_id} className="hover:bg-[#FAF7F3]/80 transition">
                    <td className="py-4 font-mono font-bold text-burgundy-700">{po.po_id}</td>
                    <td className="py-4 font-bold text-slate-900 text-sm">{po.vendor_name}</td>
                    <td className="py-4">
                      <div className="font-medium text-slate-800">{po.items}</div>
                      <div className="text-[11px] text-slate-400">By {po.requested_by}</div>
                    </td>
                    <td className="py-4 text-slate-500 font-medium">{po.request_date}</td>
                    <td className="py-4 text-right font-black text-slate-900 text-sm tabular-nums">
                      ₹{po.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : po.status === 'Fulfilled'
                          ? 'bg-burgundy-50 text-burgundy-700 border border-burgundy-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Vendor Disbursements & Payment Vouchers</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Disbursed bank transfers, payment vouchers, and vendor settlement receipts</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Payment ID</th>
                  <th className="pb-3.5">Vendor Name</th>
                  <th className="pb-3.5">Bill Reference</th>
                  <th className="pb-3.5">Disbursement Account</th>
                  <th className="pb-3.5">Payment Date</th>
                  <th className="pb-3.5 text-right">Amount (₹)</th>
                  <th className="pb-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vendorPayments.map(vp => (
                  <tr key={vp.payment_id} className="hover:bg-[#FAF7F3]/80 transition">
                    <td className="py-4 font-mono font-bold text-burgundy-700">{vp.payment_id}</td>
                    <td className="py-4 font-bold text-slate-900 text-sm">{vp.vendor_name}</td>
                    <td className="py-4 font-mono text-slate-600">{vp.bill_ref}</td>
                    <td className="py-4 text-slate-600 font-medium">{vp.bank_account}</td>
                    <td className="py-4 text-slate-500 font-medium">{vp.payment_date}</td>
                    <td className="py-4 text-right font-black text-slate-900 text-sm tabular-nums">
                      ₹{vp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {vp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Verified Vendors & Registered Suppliers</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Approved suppliers with GSTIN, PAN, and credit terms</p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map(v => (
              <div key={v.vendor_id} className="p-5 rounded-xl bg-[#FAF7F3]/80 border border-slate-200 space-y-3 hover:border-slate-300 transition">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-burgundy-50 text-burgundy-700 border border-burgundy-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{v.vendor_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{v.email}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                    {v.vendor_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-3 border-t border-slate-200/80 font-medium">
                  <div>GSTIN: <span className="font-mono text-slate-900 font-semibold">{v.gstin}</span></div>
                  <div>PAN: <span className="font-mono text-slate-900 font-semibold">{v.pan}</span></div>
                  <div>Credit Period: <span className="text-burgundy-700 font-bold">{v.payment_terms_days} Days</span></div>
                  <div>Category: <span className="text-slate-900 font-semibold">Contractor / Supplies</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Vendor Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Record Vendor Bill</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Enter supplier invoice details to generate accounts payable entry.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Supplier / Vendor</label>
                <select className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition">
                  {vendors.map(v => (
                    <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Supplier Invoice Number</label>
                  <input type="text" placeholder="e.g. INV/2026/101" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Gross Amount (₹)</label>
                  <input type="number" placeholder="50000" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Invoice Date</label>
                  <input type="date" defaultValue="2026-04-01" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Payment Due Date</label>
                  <input type="date" defaultValue="2026-04-30" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2.5 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs transition"
              >
                Record Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal */}
      {showPoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create Purchase Order</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Issue an authorized purchase order to a registered vendor.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Target Vendor</label>
                <select className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium">
                  {vendors.map(v => (
                    <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Items & Specifications</label>
                <input type="text" placeholder="e.g. Science Lab Consumables & Glassware" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Estimated Cost (₹)</label>
                  <input type="number" placeholder="75000" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Delivery Deadline</label>
                  <input type="date" defaultValue="2026-12-01" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowPoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowPoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs transition"
              >
                Issue Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
