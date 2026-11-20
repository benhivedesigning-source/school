import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Shield, 
  Check, 
  Edit2, 
  LogIn, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  Eye, 
  Building2, 
  Lock, 
  Unlock,
  AlertCircle,
  X,
  KeyRound,
  Copy,
  CheckSquare
} from 'lucide-react';
import { UserProfile, Branch, RoleDefinition, DataScope, ActionPermission } from '../types';
import { 
  DEFAULT_STAFF_ROLE_TEMPLATES, 
  MASTER_ADMIN_MENUS, 
  ALL_ACTION_PERMISSIONS,
  resolveEffectiveMenus 
} from '../permissions/permissionCatalogue';

interface StaffManagementViewProps {
  users: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onUpdateUser: (user: UserProfile) => void;
  onSwitchToStaffRole: (user: UserProfile) => void;
  branches: Branch[];
  roles?: RoleDefinition[];
  onAddRole?: (role: RoleDefinition) => void;
  onUpdateRole?: (role: RoleDefinition) => void;
  initialTab?: 'staff' | 'roles' | 'matrix' | 'overrides';
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onSwitchToStaffRole,
  branches,
  roles = DEFAULT_STAFF_ROLE_TEMPLATES,
  onAddRole = () => {},
  onUpdateRole = () => {},
  initialTab = 'staff',
  onAuditLog = () => {}
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'staff' | 'roles' | 'matrix' | 'overrides'>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveMainTab(initialTab);
  }, [initialTab]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Staff Modals state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaffForRole, setSelectedStaffForRole] = useState<UserProfile | null>(null);

  // Staff Form State
  const [staffName, setStaffName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Finance & Accounts');
  const [designation, setDesignation] = useState('Finance Officer');
  const [assignedBranchIds, setAssignedBranchIds] = useState<string[]>([branches[0]?.branch_id || 'branch-01']);
  const [assignedRoles, setAssignedRoles] = useState<string[]>([roles[0]?.roleName as string]);
  const [accountStatus, setAccountStatus] = useState<'Invited' | 'Active' | 'Inactive' | 'Locked'>('Active');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Role Management State
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(roles[0] || DEFAULT_STAFF_ROLE_TEMPLATES[0]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [modalRoleName, setModalRoleName] = useState('');
  const [modalRoleDesc, setModalRoleDesc] = useState('');
  const [modalAllowedSubmenus, setModalAllowedSubmenus] = useState<string[]>([]);
  const [modalScope, setModalScope] = useState<DataScope>('assigned_branches');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // User Overrides state
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<UserProfile>(
    users.find(u => u.role_id === 'Staff') || users[0]
  );
  const [overrideSubmenuId, setOverrideSubmenuId] = useState<string>('pay_attendance');
  const [overrideActionType, setOverrideActionType] = useState<'grant' | 'deny'>('grant');

  // Filter staff list
  const staffList = useMemo(() => {
    return users.filter(u => u.role_id === 'Staff').filter(u => {
      const matchSearch = searchQuery.trim() === '' || 
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.employee_id && u.employee_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || u.user_status === statusFilter;
      const matchBranch = branchFilter === 'all' || u.branch_ids.includes(branchFilter);
      const matchRole = roleFilter === 'all' || u.assigned_roles?.includes(roleFilter);
      return matchSearch && matchStatus && matchBranch && matchRole;
    });
  }, [users, searchQuery, statusFilter, branchFilter, roleFilter]);

  // Paginated staff
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return staffList.slice(start, start + pageSize);
  }, [staffList, currentPage]);

  const totalPages = Math.ceil(staffList.length / pageSize) || 1;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setStaffName('');
    setEmployeeId(`EMP-${Date.now().toString().slice(-4)}`);
    setEmail('');
    setPhone('+91 98400 00000');
    setDepartment('Finance & Accounts');
    setDesignation('Accounts Executive');
    setAssignedBranchIds([branches[0]?.branch_id || 'branch-01']);
    setAssignedRoles(['Finance Head / Controller']);
    setAccountStatus('Active');
    setShowStaffModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (u: UserProfile) => {
    setIsEditing(true);
    setEditingUserId(u.user_id);
    setStaffName(u.full_name);
    setEmployeeId(u.employee_id || `EMP-${u.user_id.slice(-3)}`);
    setEmail(u.email);
    setPhone(u.phone_number);
    setDepartment(u.department || 'Finance & Accounts');
    setDesignation(u.designation || 'Staff Member');
    setAssignedBranchIds(u.branch_ids);
    setAssignedRoles(u.assigned_roles || ['Finance Head / Controller']);
    setAccountStatus((u.user_status as any) || 'Active');
    setShowStaffModal(true);
  };

  // Open 5-Step Role Assignment Modal with Live Preview
  const handleOpenAssignModal = (u: UserProfile) => {
    setSelectedStaffForRole(u);
    setAssignedRoles(u.assigned_roles || ['Finance Head / Controller']);
    setAssignedBranchIds(u.branch_ids);
    setShowAssignModal(true);
  };

  // Save Staff Record
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !email) return;

    if (isEditing && editingUserId) {
      const existing = users.find(u => u.user_id === editingUserId);
      if (existing) {
        const updated: UserProfile = {
          ...existing,
          full_name: staffName,
          email,
          phone_number: phone,
          employee_id: employeeId,
          department,
          designation,
          branch_ids: assignedBranchIds,
          assigned_roles: assignedRoles,
          user_status: accountStatus as any
        };
        onUpdateUser(updated);
        onAuditLog('UPDATE', 'Staff Management', `Updated staff record for ${staffName} (${employeeId})`);
      }
    } else {
      const newStaff: UserProfile = {
        user_id: `usr-${Date.now()}`,
        full_name: staffName,
        email,
        phone_number: phone,
        employee_id: employeeId,
        department,
        designation,
        role_id: 'Staff',
        company_id: 'comp-001',
        branch_ids: assignedBranchIds,
        assigned_roles: assignedRoles,
        user_status: accountStatus as any
      };
      onAddUser(newStaff);
      onAuditLog('CREATE', 'Staff Management', `Created staff record for ${staffName} (${employeeId})`);
    }

    setShowStaffModal(false);
  };

  // Save Role Assignment
  const handleSaveRoleAssignment = () => {
    if (!selectedStaffForRole) return;
    const updated: UserProfile = {
      ...selectedStaffForRole,
      assigned_roles: assignedRoles,
      branch_ids: assignedBranchIds
    };
    onUpdateUser(updated);
    onAuditLog('UPDATE', 'Role Assignment', `Assigned roles [${assignedRoles.join(', ')}] to ${selectedStaffForRole.full_name}`);
    setShowAssignModal(false);
  };

  // Compute live preview of effective menus for selected role assignment
  const previewMenus = useMemo(() => {
    return resolveEffectiveMenus('Staff', assignedRoles, roles);
  }, [assignedRoles, roles]);

  // Duplicate Role
  const handleDuplicateRole = (role: RoleDefinition) => {
    setIsEditingRole(false);
    setModalRoleName(`${role.roleName} (Custom)`);
    setModalRoleDesc(`Customized variant based on ${role.roleName}`);
    const subIds: string[] = [];
    role.allowedMenus.forEach(m => m.submenuIds.forEach(id => subIds.push(id)));
    setModalAllowedSubmenus(subIds);
    setModalScope('assigned_branches');
    setShowRoleModal(true);
  };

  // Save custom role
  const handleSaveRole = () => {
    if (!modalRoleName.trim()) return;

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

  const sectionControls = (
    <div className="flex flex-wrap items-center gap-2 shrink-0">
      <button
        onClick={handleOpenCreateModal}
        className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span>Add New Staff</span>
      </button>
      <button
        onClick={() => {
          setIsEditingRole(false);
          setModalRoleName('Custom Staff Specialist');
          setModalRoleDesc('Tailored permission set for campus operations');
          setModalAllowedSubmenus(['dashboard', 'pay_attendance']);
          setModalScope('assigned_branches');
          setShowRoleModal(true);
        }}
        className="px-3.5 py-2 bg-white text-slate-700 hover:bg-[#FAF7F3] border border-slate-200 font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
      >
        <Shield className="w-4 h-4 text-burgundy-600 shrink-0" />
        <span>Create Custom Role</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* TAB 1: STAFF DIRECTORY */}
      {activeMainTab === 'staff' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label className="font-semibold text-slate-600">Campus:</label>
                <select
                  value={branchFilter}
                  onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
                >
                  <option value="all">All Campuses</option>
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="font-semibold text-slate-600">Role:</label>
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
                >
                  <option value="all">All Roles</option>
                  {roles.map(r => (
                    <option key={r.roleId} value={r.roleName as string}>{r.roleName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="font-semibold text-slate-600">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Invited">Invited</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff name, code or email..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 text-xs font-medium focus:outline-none focus:border-burgundy-500"
              />
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-[#FAF7F3]/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Staff Directory ({staffList.length} members)</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Click "Assign Roles" to configure role templates and preview access</p>
              </div>
              {sectionControls}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-[#FAF7F3]/80">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-3">Employee ID & Dept</th>
                    <th className="py-3 px-3">Campus</th>
                    <th className="py-3 px-3">Assigned Role(s)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        No staff members match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedStaff.map(u => (
                      <tr key={u.user_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{u.full_name}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-mono font-bold text-burgundy-700">{u.employee_id || 'EMP-100'}</div>
                          <div className="text-[11px] text-slate-500">{u.department || 'Finance'}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-slate-800 font-medium">
                            {branches.find(b => u.branch_ids.includes(b.branch_id))?.branch_name || 'Chennai Main Campus'}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {(u.assigned_roles && u.assigned_roles.length > 0) ? (
                              u.assigned_roles.map(r => (
                                <span key={r} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">No role assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.user_status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : u.user_status === 'Locked'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {u.user_status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenAssignModal(u)}
                              className="px-2.5 py-1 rounded-lg bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-700 font-bold border border-burgundy-200 transition flex items-center space-x-1 whitespace-nowrap shrink-0"
                              title="Assign Roles & Preview Navigation"
                            >
                              <Shield className="w-3 h-3 shrink-0" />
                              <span>Assign Roles</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSwitchToStaffRole(u)}
                              className="px-2.5 py-1 rounded-lg bg-champagne-50 hover:bg-champagne-100 text-champagne-700 font-bold border border-champagne-200 transition flex items-center space-x-1 whitespace-nowrap shrink-0"
                              title="Switch portal to this staff view"
                            >
                              <LogIn className="w-3 h-3 shrink-0" />
                              <span>Simulate View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t border-slate-100 flex justify-between items-center bg-[#FAF7F3]/50 text-xs text-slate-500">
              <div>Showing {paginatedStaff.length} of {staffList.length} staff members</div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-700">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE TEMPLATES & CUSTOM ROLES */}
      {activeMainTab === 'roles' && (
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
                    <span>Permitted Modules: <strong className="text-slate-900 font-bold tabular-nums">{totalPermittedSubmenus}</strong></span>
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

          {/* Role Inspector */}
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
                    className="px-3.5 py-2 bg-champagne-50 text-champagne-700 hover:bg-champagne-100 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 border border-champagne-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Sidebar</span>
                  </button>
                  <button
                    onClick={() => handleDuplicateRole(selectedRole)}
                    className="px-3.5 py-2 bg-white text-slate-700 hover:bg-[#FAF7F3] border border-slate-200 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-burgundy-600" />
                    <span>Clone as Custom</span>
                  </button>
                </div>
              </div>

              {/* Permitted Submenus Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Configured Module Permissions & Scopes</h3>
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
                <h3 className="text-sm font-bold text-slate-900">Assigned Staff Members</h3>
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

      {/* TAB 3: HIERARCHICAL PERMISSION MATRIX */}
      {activeMainTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Central Permission Catalogue Matrix</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Primary Modules → Consolidated Page Scope → Permitted Actions → Default Scope
              </p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F3] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-44">Module Name</th>
                  <th className="py-3 px-4 w-56">Merged Feature Scope</th>
                  <th className="py-3 px-4">Configured Action Permissions</th>
                  <th className="py-3 px-4 text-right">Default Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MASTER_ADMIN_MENUS.map(menu => (
                  menu.submenus.map((sub, sIdx) => (
                    <tr key={sub.id} className="hover:bg-[#FAF7F3]/70 transition-colors">
                      {sIdx === 0 && (
                        <td 
                          rowSpan={menu.submenus.length} 
                          className="py-3.5 px-4 font-bold text-slate-900 align-top border-r border-slate-100 bg-[#FAF7F3]/30"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-[#8B3552]"></span>
                            <span>{menu.title}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {sub.title}
                        {sub.id === 'pay_attendance' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-burgundy-100 text-burgundy-800">Attendance Integrated</span>
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

      {/* TAB 4: USER OVERRIDES */}
      {activeMainTab === 'overrides' && (
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
                  <label className="block text-slate-700 font-semibold mb-1">Module to Override</label>
                  <select
                    value={overrideSubmenuId}
                    onChange={(e) => setOverrideSubmenuId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="pay_attendance">Payroll → Daily Attendance</option>
                    <option value="acc_vouchers">Accounting → Vouchers</option>
                    <option value="sf_refunds">Student Finance → Refunds</option>
                    <option value="prc_payments">Procurement → Payments</option>
                    <option value="tax_rules">Tax & Compliance → Rules</option>
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
                    alert(`Override applied: ${overrideActionType === 'deny' ? 'Denied' : 'Granted'} "${overrideSubmenuId}" for ${selectedUserForOverride.full_name}. This takes strict precedence over role templates.`);
                    onAuditLog('UPDATE', 'User Overrides', `Applied ${overrideActionType.toUpperCase()} override for ${selectedUserForOverride.full_name} on ${overrideSubmenuId}`);
                  }}
                  className="px-4 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs"
                >
                  Save User Override
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <strong>Precedence Rule:</strong> User-level denials take strict precedence over inherited role permissions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT STAFF FORM MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Complete staff profile details and assigned branch scope
                </p>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. Ramesh Narayan"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-101"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-burgundy-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@greenvalley.edu"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98400 00000"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                  >
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Student Billing & Cash">Student Billing & Cash</option>
                    <option value="Procurement & Inventory">Procurement & Inventory</option>
                    <option value="Science & Academic Labs">Science & Academic Labs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Finance Officer"
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Campus / Branch</label>
                <select
                  value={assignedBranchIds[0]}
                  onChange={(e) => setAssignedBranchIds([e.target.value])}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium"
                >
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.branch_name} ({b.branch_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Active', 'Invited', 'Inactive', 'Locked'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAccountStatus(st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        accountStatus === st 
                          ? 'bg-[#8B3552] text-white border-burgundy-600 shadow-xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-[#FAF7F3]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs"
                >
                  {isEditing ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5-STEP ROLE ASSIGNMENT & PREVIEW ACCESS PANEL MODAL */}
      {showAssignModal && selectedStaffForRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-burgundy-700 uppercase tracking-wider">Role Assignment Flow</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Assign Roles to {selectedStaffForRole.full_name} ({selectedStaffForRole.employee_id})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select one or more role templates, apply campus restrictions, and review live preview navigation.
                </p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-slate-800 text-xs">
                      1. Select Role Templates ({assignedRoles.length} selected)
                    </label>
                    <span className="text-[11px] text-burgundy-700 font-semibold">8 Default Templates Available</span>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-[#FAF7F3]">
                    {roles.map(r => {
                      const isChecked = assignedRoles.includes(r.roleName as string);
                      return (
                        <div
                          key={r.roleId}
                          onClick={() => {
                            if (isChecked) {
                              setAssignedRoles(assignedRoles.filter(name => name !== r.roleName));
                            } else {
                              setAssignedRoles([...assignedRoles, r.roleName as string]);
                            }
                          }}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                            isChecked
                              ? 'bg-burgundy-50 border-burgundy-500 text-burgundy-900 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="mt-0.5 rounded text-burgundy-600 focus:ring-burgundy-500"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 text-xs">{r.roleName}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{r.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-2">
                    2. Campus & Data Scope Boundary
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {branches.map(b => {
                      const isChecked = assignedBranchIds.includes(b.branch_id);
                      return (
                        <label
                          key={b.branch_id}
                          className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                            isChecked 
                              ? 'bg-burgundy-50 border-burgundy-500 font-bold text-burgundy-900' 
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) setAssignedBranchIds(assignedBranchIds.filter(id => id !== b.branch_id));
                              else setAssignedBranchIds([...assignedBranchIds, b.branch_id]);
                            }}
                            className="rounded text-burgundy-600"
                          />
                          <span>{b.branch_name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Preview Access Panel */}
              <div className="lg:col-span-5 flex flex-col bg-[#FAF7F3] border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-burgundy-800 font-bold text-xs pb-2 border-b border-slate-200">
                  <Eye className="w-4 h-4 text-burgundy-600" />
                  <span>Preview Access Panel</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Menus, submenus, and pages <strong className="text-slate-800">{selectedStaffForRole.full_name}</strong> will see in their sidebar:
                </p>

                <div className="flex-1 max-h-72 overflow-y-auto space-y-3 pr-1">
                  {previewMenus.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 italic">
                      No roles selected. Please choose at least one role template on the left.
                    </div>
                  ) : (
                    previewMenus.map(m => (
                      <div key={m.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="font-bold text-slate-900 text-xs flex justify-between items-center">
                          <span>{m.title}</span>
                          <span className="text-[10px] text-burgundy-700 font-mono font-semibold">
                            {m.submenus.length} submenus
                          </span>
                        </div>
                        <div className="space-y-1 pl-2 border-l-2 border-burgundy-300">
                          {m.submenus.map(sub => (
                            <div key={sub.id} className="text-[11px] text-slate-600 flex items-center justify-between">
                              <span>• {sub.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 italic">
                  Empty menu groups and unassigned screens are automatically hidden.
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoleAssignment}
                className="px-5 py-2 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs"
              >
                Save Role Assignment
              </button>
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

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-semibold text-slate-700">Select Permitted Modules ({modalAllowedSubmenus.length})</label>
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
