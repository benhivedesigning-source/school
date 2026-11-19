import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, History, Filter, AlertCircle, Search } from 'lucide-react';
import { AuditLog } from '../types';

interface ApprovalsViewProps {
  auditLogs: AuditLog[];
  initialTab?: 'pending' | 'audit';
}

interface PendingApprovalItem {
  id: string;
  type: 'Fee' | 'Payment' | 'Payroll' | 'Purchase';
  title: string;
  requester: string;
  amount: number;
  date: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_APPROVALS: PendingApprovalItem[] = [
  {
    id: 'appr-01',
    type: 'Purchase',
    title: 'Vendor Bill #998 (ABC School Supplies Ltd)',
    requester: 'S. Sharma (Accountant)',
    amount: 100000,
    date: '2026-11-15',
    notes: 'Laboratory glassware and physics test bench sensors for CBSE lab renewal',
    status: 'Pending'
  },
  {
    id: 'appr-02',
    type: 'Payroll',
    title: 'November 2026 Faculty Payroll Batch (#RUN-2026-11)',
    requester: 'Divya Krishnan (HR Officer)',
    amount: 246500,
    date: '2026-11-16',
    notes: 'Net salary disbursement for 5 faculty employees after EPF, ESI, and TDS deductions',
    status: 'Pending'
  },
  {
    id: 'appr-03',
    type: 'Fee',
    title: 'Merit Scholarship & Fee Concession (Aadhavan K - Grade 11-A)',
    requester: 'Ramesh Narayan (Fee Admin)',
    amount: 15000,
    date: '2026-11-14',
    notes: 'Merit scholarship 20% waiver on term tuition fees approved by Academic Dean',
    status: 'Pending'
  },
  {
    id: 'appr-04',
    type: 'Payment',
    title: 'Emergency Generator Diesel Refueling & Maintenance',
    requester: 'Campus Facilities Manager',
    amount: 38000,
    date: '2026-11-16',
    notes: 'Urgent generator backup fuel replenishment for campus exam halls',
    status: 'Pending'
  }
];

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ auditLogs, initialTab = 'pending' }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'audit'>(initialTab);
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>(INITIAL_APPROVALS);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [selectedItemForReject, setSelectedItemForReject] = useState<PendingApprovalItem | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState<string>('');

  const handleApprove = (id: string) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleOpenReject = (item: PendingApprovalItem) => {
    setSelectedItemForReject(item);
    setRejectRemarks('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedItemForReject) return;
    setApprovals(approvals.map(a => a.id === selectedItemForReject.id ? { ...a, status: 'Rejected' } : a));
    setShowRejectModal(false);
  };

  const filteredApprovals = approvals.filter(a => {
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchType;
  });

  const filteredLogs = auditLogs.filter(log => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return log.user_name.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.action_type.toLowerCase().includes(q);
  });

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <select
        aria-label="Approvals & Governance Section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as 'pending' | 'audit')}
        className="bg-[#FAF7F3] border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer"
      >
        <option value="pending">Pending Maker-Checker Approvals ({pendingCount})</option>
        <option value="audit">Immutable Audit Trail ({auditLogs.length})</option>
      </select>
      <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shadow-2xs whitespace-nowrap">
        {pendingCount} Pending Reviews
      </span>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-600 whitespace-nowrap">Approval Category:</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Purchase', 'Payroll', 'Fee', 'Payment'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition whitespace-nowrap shrink-0 ${
                      typeFilter === type
                        ? 'bg-[#8B3552] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : `${type} Approvals`}
                  </button>
                ))}
              </div>
            </div>
            {sectionControls}
          </div>

          {/* Approvals List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="space-y-4">
              {filteredApprovals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No approval items in this category.
                </div>
              ) : (
                filteredApprovals.map(item => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-xl border transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs ${
                      item.status === 'Approved'
                        ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                        : item.status === 'Rejected'
                        ? 'bg-rose-50/50 border-rose-200 opacity-80'
                        : 'bg-[#FAF7F3] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-burgundy-100 text-burgundy-800 whitespace-nowrap">
                          {item.type}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${
                          item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{item.notes}</p>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        <span>Initiated by: <strong className="text-slate-700">{item.requester}</strong></span>
                        <span>Date: <strong className="text-slate-700">{item.date}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="text-base font-extrabold text-slate-900 tabular-nums">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Pending Authorization</div>
                      </div>

                      {item.status === 'Pending' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition whitespace-nowrap shrink-0"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenReject(item)}
                            className="px-3.5 py-2 bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold rounded-xl flex items-center space-x-1.5 transition whitespace-nowrap shrink-0"
                          >
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-slate-500 italic">
                          Action completed ({item.status})
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-burgundy-700" />
                <h3 className="text-base font-bold text-slate-900">Immutable Security Audit Trail</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Tamper-evident logs of administrative actions, role assignments, attendance entries, and ledger postings</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              {sectionControls}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search audit trail by actor or action..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Timestamp</th>
                  <th className="pb-3.5">Actor / User</th>
                  <th className="pb-3.5">Role</th>
                  <th className="pb-3.5">Action</th>
                  <th className="pb-3.5">Module</th>
                  <th className="pb-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map(log => (
                  <tr key={log.audit_log_id} className="hover:bg-[#FAF7F3]/80 transition">
                    <td className="py-4 text-slate-500 font-mono font-medium whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-4 font-bold text-slate-900 text-sm whitespace-nowrap">{log.user_name}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-slate-800">{log.module}</td>
                    <td className="py-4 text-slate-600 font-medium">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Remarks Modal */}
      {showRejectModal && selectedItemForReject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl text-xs">
            <h3 className="text-base font-bold text-slate-900">Return Request with Remarks</h3>
            <p className="text-slate-500">Provide rejection remarks for {selectedItemForReject.title}:</p>
            <textarea
              value={rejectRemarks}
              onChange={e => setRejectRemarks(e.target.value)}
              placeholder="e.g. Budget ceiling exceeded. Please attach secondary vendor quote."
              className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl p-3 h-24 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
