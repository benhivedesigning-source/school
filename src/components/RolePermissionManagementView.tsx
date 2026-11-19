import React, { useState } from 'react';
import { 
  Shield, 
  KeyRound, 
  Plus, 
  Copy, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  Eye, 
  CheckSquare, 
  Building2, 
  Sparkles,
  Users,
  ChevronRight,
  Info,
  Lock
} from 'lucide-react';
import { 
  RoleDefinition, 
  StaffRoleTemplate, 
  ActionPermission, 
  DataScope, 
  UserProfile, 
  Branch 
} from '../types';
import { 
  DEFAULT_STAFF_ROLE_TEMPLATES, 
  MASTER_ADMIN_MENUS, 
  ALL_ACTION_PERMISSIONS 
} from '../permissions/permissionCatalogue';

interface RolePermissionManagementViewProps {
  roles: RoleDefinition[];
  onAddRole: (role: RoleDefinition) => void;
  onUpdateRole: (role: RoleDefinition) => void;
  users: UserProfile[];
  branches: Branch[];
  currentRole: string;
  initialTab?: 'templates' | 'matrix' | 'overrides';
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export const RolePermissionManagementView: React.FC<RolePermissionManagementViewProps> = ({
  roles = DEFAULT_STAFF_ROLE_TEMPLATES,
  onAddRole,
  onUpdateRole,
  users,
  branches,
  currentRole,
  initialTab = 'templates',
  onAuditLog = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'matrix' | 'overrides'>(initialTab);
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(roles[0] || DEFAULT_STAFF_ROLE_TEMPLATES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom role creation / edit modal
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [modalRoleName, setModalRoleName] = useState<string>('');
  const [modalRoleDesc, setModalRoleDesc] = useState<string>('');
  const [modalAllowedSubmenus, setModalAllowedSubmenus] = useState<string[]>([]);
  const [modalScope, setModalScope] = useState<DataScope>('assigned_branches');

  // Preview simulator modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // User Overrides state
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<UserProfile>(
    users.find(u => u.role_id === 'Staff') || users[0]
  );
  const [overrideSubmenuId, setOverrideSubmenuId] = useState<string>('pay_attendance');
  const [overrideActionType, setOverrideActionType] = useState<'grant' | 'deny'>('grant');

  // Open modal to duplicate a role
  const handleDuplicateRole = (role: RoleDefinition) => {
    setIsEditingRole(false);
    setModalRoleName(`${role.roleName} (Copy)`);
    setModalRoleDesc(`Customized copy based on ${role.roleName}`);
    const subIds: string[] = [];
    role.allowedMenus.forEach(m => m.submenuIds.forEach(id => subIds.push(id)));
    setModalAllowedSubmenus(subIds);
    setModalScope('assigned_branches');
    setShowRoleModal(true);
  };

  // Save new or edited role
  const handleSaveRole = () => {
    if (!modalRoleName.trim()) return;

    // Group selected submenus by their parent menu
    const menuMap: Record<string, string[]> = {};
    MASTER_ADMIN_MENUS.forEach(menu => {
      const matchSubs = menu.submenus.filter(s => modalAllowedSubmenus.includes(s.id)).map(s => s.id);
      if (matchSubs.length > 0) {
        menuMap[menu.id] = matchSubs;
      }
    });

    const allowedMenus = Object.entries(menuMap).map(([menuId, submenuIds]) => ({
      menuId,
      submenuIds,
      scope: modalScope
    }));

    if (isEditingRole && !selectedRole.isDefaultTemplate) {
      const updated: RoleDefinition = {
        ...selectedRole,
        roleName: modalRoleName,
        description: modalRoleDesc,
        allowedMenus
      };
      onUpdateRole(updated);
      setSelectedRole(updated);
      onAuditLog('UPDATE', 'Role Management', `Updated custom role: ${modalRoleName}`);
    } else {
      const newRole: RoleDefinition = {
        roleId: `role-custom-${Date.now()}`,
        roleName: modalRoleName,
        isDefaultTemplate: false,
        description: modalRoleDesc,
        assignedStaffCount: 0,
        allowedMenus
      };
      onAddRole(newRole);
      setSelectedRole(newRole);
      onAuditLog('CREATE', 'Role Management', `Created new custom role: ${modalRoleName}`);
    }

    setShowRoleModal(false);
  };

  // Filtered menus for matrix
  const filteredMatrixMenus = MASTER_ADMIN_MENUS.filter(menu => {
    if (!searchQuery.trim()) return true;
    const matchMenu = menu.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSub = menu.submenus.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchMenu || matchSub;
  });

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      <select
        aria-label="Role & Permission Section"
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value as 'templates' | 'matrix' | 'overrides')}
        className="bg-white border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer shadow-xs"
      >
        <option value="templates">Default Roles & Templates ({roles.length})</option>
        <option value="matrix">Granular Permission Matrix</option>
        <option value="overrides">User-Specific Overrides</option>
      </select>
      <button
        onClick={() => {
          setIsEditingRole(false);
          setModalRoleName('New Custom Staff Role');
          setModalRoleDesc('Custom tailored permission profile');
          setModalAllowedSubmenus(['dash_branch_overview', 'pay_attendance']);
          setModalScope('assigned_branches');
          setShowRoleModal(true);
        }}
        className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-2 whitespace-nowrap shrink-0"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>Create Custom Role</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* TAB 1: DEFAULT ROLE TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map(role => {
              const isSelected = selectedRole.roleId === role.roleId;
              const totalPermittedSubmenus = role.allowedMenus.reduce((acc, m) => acc + m.submenuIds.length, 0);

              return (
                <div
                  key={role.roleId}
                  onClick={() => setSelectedRole(role)}
                  className={`p-5 rounded-2xl border transition cursor-pointer text-xs space-y-3 relative ${
                    isSelected
                      ? 'bg-burgundy-50/40 border-burgundy-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-burgundy-100 text-burgundy-800 font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    {role.isDefaultTemplate ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Default Template
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-champagne-50 text-champagne-700 border border-champagne-200">
                        Custom Role
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{role.roleName}</h3>
                    <p className="text-slate-500 text-[11px] font-medium line-clamp-2 mt-1 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-600 font-medium">
                    <span>Submenus: <strong className="text-slate-900 font-bold tabular-nums">{totalPermittedSubmenus}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateRole(role);
                      }}
                      className="text-burgundy-700 hover:text-burgundy-900 font-bold flex items-center space-x-1"
                      title="Duplicate this role"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Duplicate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector for Selected Role */}
          {selectedRole && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider">Role Inspector</span>
                    {selectedRole.isDefaultTemplate && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">Standard</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedRole.roleName}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedRole.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {sectionControls}
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="px-3.5 py-2 bg-champagne-50 text-champagne-700 hover:bg-champagne-100 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 border border-champagne-200 whitespace-nowrap shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>Preview Staff Navigation</span>
                  </button>
                  <button
                    onClick={() => handleDuplicateRole(selectedRole)}
                    className="px-3.5 py-2 bg-white text-slate-700 hover:bg-[#FAF7F3] border border-slate-200 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-burgundy-600 shrink-0" />
                    <span>Duplicate as Custom</span>
                  </button>
                </div>
              </div>

              {/* Permitted Submenus Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Configured Module Access & Permitted Submenus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedRole.allowedMenus.map(m => {
                    const menuDef = MASTER_ADMIN_MENUS.find(def => def.id === m.menuId);
                    return (
                      <div key={m.menuId} className="p-4 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="font-bold text-slate-900">{menuDef?.title || m.menuId}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                            {m.scope || 'assigned_branches'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {m.submenuIds.map(subId => {
                            const subDef = menuDef?.submenus.find(s => s.id === subId);
                            return (
                              <div key={subId} className="flex items-center space-x-2 text-slate-700 font-medium">
                                <Check className="w-3.5 h-3.5 text-burgundy-600 shrink-0" />
                                <span>{subDef?.title || subId}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Staff Members for this Role */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Active Staff Assigned to this Role</h3>
                <div className="flex flex-wrap gap-2">
                  {users.filter(u => u.assigned_roles?.includes(selectedRole.roleName as string)).map(u => (
                    <div key={u.user_id} className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FAF7F3] border border-slate-200 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-bold text-slate-800">{u.full_name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{u.employee_id}</span>
                    </div>
                  ))}
                  {users.filter(u => u.assigned_roles?.includes(selectedRole.roleName as string)).length === 0 && (
                    <div className="text-xs text-slate-400 italic">No staff members currently assigned to this specific template.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HIERARCHICAL PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Central Permission Catalogue Hierarchy</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Main Menu → Submenu / Page → Allowed Actions → Data Scope
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {sectionControls}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search permissions or modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F3] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-44">Main Menu</th>
                  <th className="py-3 px-4 w-52">Submenu / Page</th>
                  <th className="py-3 px-4">Standard Permitted Actions</th>
                  <th className="py-3 px-4 text-right">Default Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMatrixMenus.map(menu => (
                  menu.submenus.map((sub, sIdx) => (
                    <tr key={sub.id} className="hover:bg-[#FAF7F3]/70 transition-colors">
                      {sIdx === 0 && (
                        <td 
                          rowSpan={menu.submenus.length} 
                          className="py-3.5 px-4 font-bold text-slate-900 align-top border-r border-slate-100 bg-[#FAF7F3]/30"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B3552]"></span>
                            <span>{menu.title}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {sub.title}
                        {sub.id === 'pay_attendance' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-burgundy-100 text-burgundy-800">New Attendance</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.actions.map(act => (
                            <span 
                              key={act} 
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-burgundy-700 font-semibold">
                        {sub.scope}
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER-SPECIFIC OVERRIDES & DENIAL PRECEDENCE */}
      {activeTab === 'overrides' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">User-Specific Permission Overrides</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Explicit user-level denials take strict precedence over inherited role permissions.
              </p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Selector */}
            <div className="space-y-3">
              <label className="block text-slate-700 font-bold text-xs">Select Staff Member</label>
              <div className="space-y-1.5 max-h-80 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-[#FAF7F3]">
                {users.filter(u => u.role_id === 'Staff').map(u => {
                  const isSel = selectedUserForOverride.user_id === u.user_id;
                  return (
                    <button
                      key={u.user_id}
                      onClick={() => setSelectedUserForOverride(u)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition ${
                        isSel 
                          ? 'bg-[#8B3552] text-white font-bold shadow-xs' 
                          : 'bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{u.full_name}</div>
                      <div className={`text-[11px] ${isSel ? 'text-burgundy-100' : 'text-slate-400'}`}>
                        {u.assigned_roles?.[0] || 'Staff Member'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Override Controls */}
            <div className="md:col-span-2 p-6 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">
                  Overrides for: {selectedUserForOverride.full_name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                  Role: {selectedUserForOverride.assigned_roles?.[0] || 'Staff'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Submenu / Page to Override</label>
                  <select
                    value={overrideSubmenuId}
                    onChange={(e) => setOverrideSubmenuId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="pay_attendance">Payroll → Attendance</option>
                    <option value="acc_vouchers">Accounting → Vouchers</option>
                    <option value="sf_refunds">Student Finance → Refunds</option>
                    <option value="prc_payments">Procurement → Payments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Override Type</label>
                  <select
                    value={overrideActionType}
                    onChange={(e) => setOverrideActionType(e.target.value as 'grant' | 'deny')}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                  >
                    <option value="deny">Explicit Denial (Blocks Access)</option>
                    <option value="grant">Explicit Grant (Overrides Role)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    alert(`Override applied: ${overrideActionType === 'deny' ? 'Denied' : 'Granted'} "${overrideSubmenuId}" for ${selectedUserForOverride.full_name}. This takes precedence over role templates.`);
                    onAuditLog('UPDATE', 'User Overrides', `Applied ${overrideActionType.toUpperCase()} override for ${selectedUserForOverride.full_name} on ${overrideSubmenuId}`);
                  }}
                  className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs"
                >
                  Save User Override
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>Enforcement Rule:</strong> Explicit user-level denials take precedence over any granted permissions across all assigned roles.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CUSTOM ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditingRole ? 'Edit Role Permissions' : 'Create Custom Role Definition'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Select allowed submenus and assign boundary data scopes
                </p>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role Name</label>
                  <input
                    type="text"
                    value={modalRoleName}
                    onChange={(e) => setModalRoleName(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Scope Boundary</label>
                  <select
                    value={modalScope}
                    onChange={(e) => setModalScope(e.target.value as DataScope)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                  >
                    <option value="assigned_branches">Assigned Branches Only</option>
                    <option value="assigned_bank_accounts">Assigned Bank Accounts Only</option>
                    <option value="authorised_records">Authorised Records Only (Auditor)</option>
                    <option value="all">Unrestricted (All Campuses)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={modalRoleDesc}
                  onChange={(e) => setModalRoleDesc(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900"
                />
              </div>

              {/* Module & Submenu Selection Matrix */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-semibold text-slate-700">Select Permitted Submenus ({modalAllowedSubmenus.length})</label>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        const allSubs: string[] = [];
                        MASTER_ADMIN_MENUS.forEach(m => m.submenus.forEach(s => allSubs.push(s.id)));
                        setModalAllowedSubmenus(allSubs);
                      }}
                      className="text-burgundy-700 font-bold hover:underline text-[11px]"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => setModalAllowedSubmenus([])}
                      className="text-slate-500 font-semibold hover:underline text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-4 bg-[#FAF7F3]">
                  {MASTER_ADMIN_MENUS.map(menu => (
                    <div key={menu.id} className="space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1">
                        {menu.title}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {menu.submenus.map(sub => {
                          const isChecked = modalAllowedSubmenus.includes(sub.id);
                          return (
                            <label key={sub.id} className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setModalAllowedSubmenus(modalAllowedSubmenus.filter(id => id !== sub.id));
                                  } else {
                                    setModalAllowedSubmenus([...modalAllowedSubmenus, sub.id]);
                                  }
                                }}
                                className="rounded text-burgundy-600 focus:ring-burgundy-500"
                              />
                              <span className="text-slate-800 font-medium">{sub.title}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button onClick={() => setShowRoleModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                Cancel
              </button>
              <button onClick={handleSaveRole} className="px-5 py-2 rounded-xl bg-[#8B3552] text-white font-semibold shadow-xs">
                Save Role Definition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW STAFF NAVIGATION MODAL */}
      {showPreviewModal && selectedRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">Preview Staff Navigation Sidebar</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Effective visible menus for <strong className="text-slate-900">{selectedRole.roleName}</strong>
                </p>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#FAF7F3]">
              <div className="p-3 bg-burgundy-50 border-b border-burgundy-100 flex items-center space-x-2 text-burgundy-800 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Simulated Role: {selectedRole.roleName}</span>
              </div>
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                {selectedRole.allowedMenus.map(m => {
                  const menuDef = MASTER_ADMIN_MENUS.find(def => def.id === m.menuId);
                  return (
                    <div key={m.menuId} className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {menuDef?.title}
                      </div>
                      <div className="pl-2 space-y-1 border-l-2 border-burgundy-200">
                        {m.submenuIds.map(subId => {
                          const subDef = menuDef?.submenus.find(s => s.id === subId);
                          return (
                            <div key={subId} className="py-1 px-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium flex justify-between items-center">
                              <span>{subDef?.title}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
