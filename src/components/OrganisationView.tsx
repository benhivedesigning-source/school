import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  FileCheck, 
  Eye, 
  Edit3, 
  X,
  Lock
} from 'lucide-react';
import { Company, Branch, UserProfile, FinancialYear } from '../types';
import { MOCK_FINANCIAL_YEARS } from '../mockData';

interface OrganisationViewProps {
  companies: Company[];
  branches: Branch[];
  users: UserProfile[];
}

export const OrganisationView: React.FC<OrganisationViewProps> = ({
  companies,
  branches,
  users
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'branches' | 'fy' | 'gst' | 'users'>('companies');
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>(MOCK_FINANCIAL_YEARS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectItem, setInspectItem] = useState<{ title: string; type: string; data: any } | null>(null);

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <select
        aria-label="Organisation Section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as 'companies' | 'branches' | 'fy' | 'gst' | 'users')}
        className="bg-[#FAF7F3] border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer"
      >
        <option value="companies">Legal Companies ({companies.length})</option>
        <option value="branches">Campuses & Branches ({branches.length})</option>
        <option value="fy">Financial Year & Books Closing</option>
        <option value="gst">GST Registrations</option>
        <option value="users">Campus Administrators ({users.length})</option>
      </select>
      <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>Add New Entity / Branch</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Legal Entities & Trusts</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Top-level parent corporate and charitable societies holding school assets</p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(c => (
              <div key={c.company_id} className="p-6 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-4 hover:border-slate-300 transition relative">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-burgundy-100 text-burgundy-700 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-base truncate">{c.display_name}</h4>
                      <p className="text-xs text-slate-500 font-medium truncate">{c.legal_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" />
                      {c.company_status}
                    </span>
                    <button
                      onClick={() => setInspectItem({ title: c.display_name, type: 'Company Profile', data: c })}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => alert(`Edit profile for ${c.display_name}`)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-burgundy-700 hover:bg-burgundy-50"
                      title="Edit Entity"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-4 border-t border-slate-200/80 font-medium">
                  <div>Entity Type: <span className="text-slate-900 font-bold">{c.entity_type}</span></div>
                  <div>Base Currency: <span className="text-slate-900 font-bold">{c.base_currency}</span></div>
                  <div>Company Code: <span className="text-burgundy-700 font-mono font-bold">{c.company_code}</span></div>
                  <div>Books Beginning: <span className="text-slate-900 font-semibold">{c.books_beginning_date}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campuses, Schools & Branch Locations</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Operating campuses mapped to independent balance sheets and bank accounts</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Branch Code</th>
                  <th className="pb-3.5">Campus / Branch Name</th>
                  <th className="pb-3.5">Branch Type</th>
                  <th className="pb-3.5">Head Office Flag</th>
                  <th className="pb-3.5 text-center">Status</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branches.map(b => (
                  <tr key={b.branch_id} className="hover:bg-[#FAF7F3]/80 transition">
                    <td className="py-4 font-mono text-burgundy-700 font-semibold">{b.branch_code}</td>
                    <td className="py-4 font-bold text-slate-900 text-sm">{b.branch_name}</td>
                    <td className="py-4 text-slate-600 font-medium">{b.branch_type}</td>
                    <td className="py-4">
                      {b.is_head_office ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                          Headquarters
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">Campus</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {b.branch_status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setInspectItem({ title: b.branch_name, type: 'Campus Branch', data: b })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="View Branch"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => alert(`Edit branch details for ${b.branch_name}`)}
                          className="p-1.5 rounded-lg text-burgundy-600 hover:text-burgundy-900 hover:bg-burgundy-50 transition"
                          title="Edit Branch"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Year & Books Closing Tab */}
      {activeTab === 'fy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial Years & Books Closing</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Manage accounting periods and year-end inventory or trial balance locks</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Period Name</th>
                  <th className="pb-3.5">Start Date</th>
                  <th className="pb-3.5">End Date</th>
                  <th className="pb-3.5 text-center">Period Status</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {financialYears.map(fy => (
                  <tr key={fy.financial_year_id} className="hover:bg-[#FAF7F3]/80">
                    <td className="py-4 font-bold text-slate-900 text-sm">{fy.year_name}</td>
                    <td className="py-4 text-slate-600 font-mono">{fy.start_date}</td>
                    <td className="py-4 text-slate-600 font-mono">{fy.end_date}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        fy.period_status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {fy.period_status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setInspectItem({ title: fy.year_name, type: 'Financial Year', data: fy })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setFinancialYears(financialYears.map(f => f.financial_year_id === fy.financial_year_id ? { ...f, period_status: f.period_status === 'Open' ? 'Locked' : 'Open' } : f));
                          }}
                          className="p-1.5 rounded-lg text-burgundy-600 hover:bg-burgundy-50"
                          title="Toggle Lock Status"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GST Registrations Tab */}
      {activeTab === 'gst' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">GSTIN Registrations by State & Campus</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">State-wise Goods and Services Tax identification numbers</p>
            </div>
            {sectionControls}
          </div>

          <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tamil Nadu Campus (Chennai Main)</h4>
                <p className="text-xs text-burgundy-700 font-mono font-bold mt-0.5">GSTIN: 33AABCA1234F1Z5</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200 font-medium">
              <div>State Jurisdiction: <strong className="text-slate-900">Tamil Nadu (33)</strong></div>
              <div>Filing Frequency: <strong className="text-slate-900">Monthly (GSTR-3B)</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">User Directory & Campus Administrators</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Assigned administrative personnel across trust companies and branches</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Full Name</th>
                  <th className="pb-3.5">Email & Phone</th>
                  <th className="pb-3.5">Assigned System Role</th>
                  <th className="pb-3.5 text-center">Status</th>
                  <th className="pb-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.user_id} className="hover:bg-[#FAF7F3]/80 transition">
                    <td className="py-4 font-bold text-slate-900 text-sm">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-burgundy-50 text-burgundy-700 border border-burgundy-100">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <span>{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-slate-800 font-medium">{u.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.phone_number}</div>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                        {u.role_id}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {u.user_status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setInspectItem({ title: u.full_name, type: 'User Profile', data: u })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => alert(`Edit user permissions for ${u.full_name}`)}
                          className="p-1.5 rounded-lg text-burgundy-600 hover:bg-burgundy-50"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT MODAL */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-burgundy-700 uppercase">{inspectItem.type}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{inspectItem.title}</h3>
              </div>
              <button onClick={() => setInspectItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-2 font-mono text-[11px] text-slate-700 max-h-60 overflow-y-auto">
              <pre>{JSON.stringify(inspectItem.data, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setInspectItem(null)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Entity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add New Legal Entity / Company</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Enter educational trust or legal society parameters for the group.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Company / Display Name</label>
                <input type="text" placeholder="Green Valley Sports Academy" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Legal Registered Name</label>
                <input type="text" placeholder="Green Valley Sports Education Foundation" className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Entity Type</label>
                  <select className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 focus:bg-white transition">
                    <option>Trust</option>
                    <option>Society</option>
                    <option>Section 8 Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Base Currency</label>
                  <input type="text" value="INR (₹)" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-bold" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs transition"
              >
                Save Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
