import React, { useState } from 'react';
import { Building2, Shield, Users, GraduationCap, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { DemoRole, UserProfile } from '../types';

interface LoginViewProps {
  onLogin: (role: DemoRole, staffUser?: UserProfile) => void;
  staffUsers: UserProfile[];
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, staffUsers }) => {
  const [selectedRoleType, setSelectedRoleType] = useState<DemoRole>('Admin');
  const [email, setEmail] = useState('admin@greenvalley.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedStaffId, setSelectedStaffId] = useState(staffUsers[0]?.user_id || '');
  const [parentChildName, setParentChildName] = useState('Aadhavan K (Grade 12-A)');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoleType === 'Staff') {
      const foundStaff = staffUsers.find(u => u.user_id === selectedStaffId) || staffUsers[0];
      onLogin('Staff', foundStaff);
    } else {
      onLogin(selectedRoleType);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-burgundy-200/50 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Banner Column - Plum & Burgundy with Champagne Accents */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#352331] via-[#8B3552] to-[#281A26] p-8 sm:p-10 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A572]/20 border border-[#C5A572]/40 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#C5A572]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight">Green Valley ERP</span>
                <div className="text-[10px] text-[#C5A572] font-mono">School Finance & Governance</div>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Real-Time School Financial Management
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                Secure multi-tenant platform featuring double-entry accounting, real-time fee collections, biometric payroll attendance, and strict role-based access.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-slate-300 space-y-2">
            <div className="flex items-center space-x-2 text-[#C5A572]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Burgundy & Champagne Theme Edition</span>
            </div>
            <div className="flex items-center space-x-2 text-[#C5A572]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Multi-Tier Role Access Control</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Sign in to your portal</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Choose your account role and enter credentials to proceed.</p>
            </div>

            {/* Role Type Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setSelectedRoleType('Admin'); setEmail('admin@greenvalley.edu'); }}
                className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-center space-y-1 ${
                  selectedRoleType === 'Admin'
                    ? 'bg-[#8B3552]/10 border-[#8B3552] text-[#8B3552] font-bold shadow-xs'
                    : 'bg-[#FAF7F3]/60 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className={`w-4 h-4 ${selectedRoleType === 'Admin' ? 'text-[#8B3552]' : 'text-slate-400'}`} />
                <span className="text-xs">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRoleType('Superadmin'); setEmail('superadmin@greenvalley.edu'); }}
                className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-center space-y-1 ${
                  selectedRoleType === 'Superadmin'
                    ? 'bg-[#8B3552]/10 border-[#8B3552] text-[#8B3552] font-bold shadow-xs'
                    : 'bg-[#FAF7F3]/60 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${selectedRoleType === 'Superadmin' ? 'text-[#8B3552]' : 'text-slate-400'}`} />
                <span className="text-xs">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRoleType('Staff'); setEmail('staff@greenvalley.edu'); }}
                className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-center space-y-1 ${
                  selectedRoleType === 'Staff'
                    ? 'bg-[#8B3552]/10 border-[#8B3552] text-[#8B3552] font-bold shadow-xs'
                    : 'bg-[#FAF7F3]/60 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className={`w-4 h-4 ${selectedRoleType === 'Staff' ? 'text-[#8B3552]' : 'text-slate-400'}`} />
                <span className="text-xs">Staff Portal</span>
              </button>

              <button
                type="button"
                onClick={() => { setSelectedRoleType('Parent'); setEmail('parent@greenvalley.edu'); }}
                className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-center space-y-1 ${
                  selectedRoleType === 'Parent'
                    ? 'bg-[#C5A572]/15 border-[#C5A572] text-[#8B3552] font-bold shadow-xs'
                    : 'bg-[#FAF7F3]/60 border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${selectedRoleType === 'Parent' ? 'text-[#C5A572]' : 'text-slate-400'}`} />
                <span className="text-xs">Parent</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              
              {selectedRoleType === 'Staff' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Select Staff Role Template</label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#8B3552]"
                  >
                    {staffUsers.map(u => (
                      <option key={u.user_id} value={u.user_id}>
                        {u.full_name} — {u.assigned_roles?.[0] || 'Staff'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedRoleType === 'Parent' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Select Linked Child</label>
                  <select
                    value={parentChildName}
                    onChange={(e) => setParentChildName(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C5A572]"
                  >
                    <option value="Aadhavan K (Grade 12-A)">Aadhavan K (Grade 12-A)</option>
                    <option value="Harini Sundaram (Grade 9-B)">Harini Sundaram (Grade 9-B)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F3] border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#8B3552]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F3] border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#8B3552]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#8B3552] hover:bg-[#722B43] shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Access {selectedRoleType === 'Staff' ? 'Staff Portal' : selectedRoleType === 'Parent' ? 'Parent Portal' : `${selectedRoleType} Dashboard`}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A572]" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Secure 256-bit SSL Session</span>
            <span className="text-[#8B3552] font-semibold">Burgundy & Champagne Theme</span>
          </div>
        </div>

      </div>
    </div>
  );
};
