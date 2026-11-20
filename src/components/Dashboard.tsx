import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Landmark,
  ShoppingBag,
  Coins,
  Package,
  FileCheck
} from 'lucide-react';
import {
  Company,
  Branch,
  FinancialYear,
  AccountingVoucher,
  FeeInvoice,
  FeePayment,
  AttendanceRecord,
  AuditLog,
  UserProfile,
  RoleDefinition,
  DemoRole
} from '../types';
import {
  MOCK_BANK_ACCOUNTS,
  MOCK_BUDGETS,
  MOCK_EMPLOYEES,
  MOCK_PAYROLL_RUNS,
  MOCK_VENDORS,
  MOCK_VENDOR_BILLS,
  MOCK_FIXED_ASSETS,
  MOCK_TAX_RULES,
  MOCK_STUDENTS,
  MOCK_FEE_HEADS,
  MOCK_PAYMENTS,
  MOCK_ATTENDANCE,
  MOCK_AUDIT_LOGS
} from '../mockData';
import { DEFAULT_STAFF_ROLE_TEMPLATES, resolveEffectiveMenus } from '../permissions/permissionCatalogue';

interface DashboardProps {
  selectedCompany: Company;
  selectedBranch: Branch;
  selectedFy: FinancialYear;
  vouchers: AccountingVoucher[];
  invoices: FeeInvoice[];
  payments?: FeePayment[];
  attendanceRecords?: AttendanceRecord[];
  auditLogs?: AuditLog[];
  branches?: Branch[];
  users?: UserProfile[];
  roles?: RoleDefinition[];
  onNavigate: (tab: string) => void;
  currentRole?: DemoRole;
  staffModules?: string[];
  activeStaffUser?: UserProfile;
}

const FEE_HEAD_COLORS = ['#8B3552', '#C5A572', '#352331', '#64748B'];

export const Dashboard: React.FC<DashboardProps> = ({
  selectedCompany,
  selectedFy,
  vouchers,
  invoices,
  payments = MOCK_PAYMENTS,
  attendanceRecords = MOCK_ATTENDANCE,
  auditLogs = MOCK_AUDIT_LOGS,
  roles = DEFAULT_STAFF_ROLE_TEMPLATES,
  onNavigate,
  currentRole = 'Admin',
  activeStaffUser
}) => {
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [hoveredFeeIdx, setHoveredFeeIdx] = useState<number | null>(null);
  const [activityTab, setActivityTab] = useState<'vouchers' | 'audit'>('vouchers');

  const isStaff = currentRole === 'Staff';

  const permittedSubmenuIds = useMemo(() => {
    const accountType = currentRole === 'Superadmin' ? 'Super Admin' : currentRole === 'Admin' ? 'Admin' : currentRole === 'Parent' ? 'Parent' : 'Staff';
    const menus = resolveEffectiveMenus(
      accountType,
      activeStaffUser?.assigned_roles || ['Finance Head / Controller'],
      roles,
      activeStaffUser?.user_overrides
    );
    const ids = new Set<string>();
    menus.forEach(m => m.submenus.forEach(s => ids.add(s.id)));
    return ids;
  }, [currentRole, activeStaffUser, roles]);

  const canAccess = (submenuOrMenuPrefix: string) => {
    if (!isStaff) return true;
    if (permittedSubmenuIds.has(submenuOrMenuPrefix)) return true;
    const prefixMap: Record<string, string> = {
      accounting_setup: 'acc_',
      student_finance: 'sf_',
      banking: 'bnk_',
      procurement: 'prc_',
      payroll: 'pay_',
      tax_compliance: 'tax_',
      reports: 'rep_'
    };
    const prefix = prefixMap[submenuOrMenuPrefix];
    if (prefix) {
      return Array.from(permittedSubmenuIds).some(id => id.startsWith(prefix));
    }
    return false;
  };

  // Live metrics computed directly from each menu's records
  const studentFinanceMetrics = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.net_amount || 0), 0);
    const totalCollected = payments
      .filter(p => p.payment_status === 'Success')
      .reduce((sum, p) => sum + p.payment_amount, 0);
    const outstanding = Math.max(0, totalBilled - totalCollected);
    return { totalBilled, totalCollected, outstanding };
  }, [invoices, payments]);

  const bankMetrics = useMemo(() => {
    const totalBalance = MOCK_BANK_ACCOUNTS.reduce((sum, b) => sum + b.opening_book_balance, 0);
    return { totalBalance, count: MOCK_BANK_ACCOUNTS.length };
  }, []);

  const payrollMetrics = useMemo(() => {
    const latestRun = MOCK_PAYROLL_RUNS[MOCK_PAYROLL_RUNS.length - 1];
    const totalPayrollDisbursed = MOCK_PAYROLL_RUNS.reduce((sum, r) => sum + r.net_pay, 0);
    return {
      latestNetPay: latestRun?.net_pay || 0,
      latestGrossPay: latestRun?.gross_earnings || 0,
      latestMonth: latestRun?.month_name || 'November 2026',
      totalPayrollDisbursed,
      employeeCount: MOCK_EMPLOYEES.length
    };
  }, []);

  const budgetMetrics = useMemo(() => {
    const allocated = MOCK_BUDGETS.reduce((sum, b) => sum + b.allocated_amount, 0);
    const spent = MOCK_BUDGETS.reduce((sum, b) => sum + b.spent_amount, 0);
    const committed = MOCK_BUDGETS.reduce((sum, b) => sum + b.pending_commitments, 0);
    const pct = allocated > 0 ? Math.round(((spent + committed) / allocated) * 100) : 0;
    return { allocated, spent, committed, pct };
  }, []);

  const attendanceBreakdown = useMemo(() => {
    const latestDate = attendanceRecords[0]?.attendance_date || '2026-11-17';
    const dayRecords = attendanceRecords.filter(r => r.attendance_date === latestDate);
    const counts = {
      Present: dayRecords.filter(r => r.status === 'Present').length,
      'Half Day': dayRecords.filter(r => r.status === 'Half Day').length,
      Leave: dayRecords.filter(r => r.status === 'Leave').length,
      Absent: dayRecords.filter(r => r.status === 'Absent').length
    };
    const total = dayRecords.length || 1;
    return { latestDate, counts, total };
  }, [attendanceRecords]);

  const voucherVolume = useMemo(
    () => vouchers.reduce((sum, v) => sum + v.total_debit, 0),
    [vouchers]
  );

  const vendorPayables = useMemo(() => {
    const openAmount = MOCK_VENDOR_BILLS.reduce((sum, b) => sum + b.outstanding_amount, 0);
    return { openAmount, billCount: MOCK_VENDOR_BILLS.length, vendorCount: MOCK_VENDORS.length };
  }, []);

  const assetBookTotal = useMemo(
    () => MOCK_FIXED_ASSETS.reduce((sum, a) => sum + a.current_book_value, 0),
    []
  );

  // Module comparison bar chart dataset — 100% derived from actual menu totals
  const modulePositionSeries = useMemo(() => {
    const rows = [
      { label: 'Bank Balances', menuTitle: 'Banking', menuId: 'bnk_reconciliation', amount: bankMetrics.totalBalance, color: '#8B3552' },
      { label: 'Fixed Assets', menuTitle: 'Inventory & Assets', menuId: 'inventory_assets', amount: assetBookTotal, color: '#352331' },
      { label: 'Budget Allocated', menuTitle: 'Budgets & Funds', menuId: 'budgets_funds', amount: budgetMetrics.allocated, color: '#C5A572' },
      { label: 'Budget Spent', menuTitle: 'Budgets & Funds', menuId: 'budgets_funds', amount: budgetMetrics.spent, color: '#A88752' },
      { label: 'Vouchers Posted', menuTitle: 'Accounting Setup', menuId: 'acc_vouchers', amount: voucherVolume, color: '#722B43' },
      { label: 'Payroll Runs', menuTitle: 'Payroll', menuId: 'pay_runs', amount: payrollMetrics.totalPayrollDisbursed, color: '#8B3552' },
      { label: 'Vendor Payables', menuTitle: 'Procurement', menuId: 'prc_bills', amount: vendorPayables.openAmount, color: '#64748B' },
      { label: 'Fee Invoiced', menuTitle: 'Student Finance', menuId: 'sf_invoices', amount: studentFinanceMetrics.totalBilled, color: '#C5A572' }
    ];
    return rows.filter(r => canAccess(r.menuId));
  }, [
    bankMetrics.totalBalance,
    assetBookTotal,
    budgetMetrics.allocated,
    budgetMetrics.spent,
    voucherVolume,
    payrollMetrics.totalPayrollDisbursed,
    vendorPayables.openAmount,
    studentFinanceMetrics.totalBilled,
    currentRole,
    permittedSubmenuIds
  ]);

  const maxModuleVal = Math.max(1, ...modulePositionSeries.map(d => d.amount));

  // Fee Head breakdown computed live from Fee Invoices lines + Fee Heads
  const feeBreakdownData = useMemo(() => {
    const totalsByHead: Record<string, number> = {};
    invoices.forEach(inv => {
      inv.lines?.forEach(line => {
        totalsByHead[line.fee_head_id] = (totalsByHead[line.fee_head_id] || 0) + line.line_amount;
      });
    });

    const activeHeads = MOCK_FEE_HEADS
      .map((fh, idx) => ({
        id: fh.fee_head_id,
        name: fh.fee_head_name,
        code: fh.fee_head_code,
        amount: totalsByHead[fh.fee_head_id] || 0,
        color: FEE_HEAD_COLORS[idx % FEE_HEAD_COLORS.length]
      }))
      .filter(h => h.amount > 0);

    const grandTotal = activeHeads.reduce((sum, h) => sum + h.amount, 0);
    let cumulativeAngle = 0;
    const segments = activeHeads.map(item => {
      const share = grandTotal > 0 ? item.amount / grandTotal : 0;
      const startAngle = cumulativeAngle;
      const sweepAngle = share * 360;
      cumulativeAngle += sweepAngle;
      return {
        ...item,
        sharePct: Math.round(share * 100),
        startAngle,
        endAngle: cumulativeAngle
      };
    });

    return { items: segments, grandTotal };
  }, [invoices]);

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const safeEnd = endAngle - startAngle >= 359.5 ? startAngle + 359.5 : endAngle;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((safeEnd - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = safeEnd - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP KPI STRIP — Live Figures from Student Finance, Banking, Payroll & Budgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <button
          type="button"
          onClick={() => canAccess('sf_invoices') && onNavigate('sf_invoices')}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors flex flex-col justify-between h-full group"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-slate-500 text-xs font-semibold">Student Fee Invoiced</span>
            <TrendingUp className="w-4 h-4 text-[#8B3552] shrink-0" />
          </div>
          <div className="mt-3 w-full">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              ₹{studentFinanceMetrics.totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between gap-2 text-xs mt-1.5 text-slate-500 tabular-nums">
              <span className="truncate">Collected: ₹{studentFinanceMetrics.totalCollected.toLocaleString('en-IN')}</span>
              {canAccess('sf_invoices') && (
                <span className="text-[#8B3552] font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  Student Finance <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => canAccess('bnk_reconciliation') && onNavigate('bnk_reconciliation')}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors flex flex-col justify-between h-full group"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-slate-500 text-xs font-semibold">Bank Book Balance</span>
            <Landmark className="w-4 h-4 text-[#C5A572] shrink-0" />
          </div>
          <div className="mt-3 w-full">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              ₹{(bankMetrics.totalBalance / 100000).toFixed(2)} L
            </div>
            <div className="flex items-center justify-between gap-2 text-xs mt-1.5 text-slate-500 tabular-nums">
              <span className="truncate">{bankMetrics.count} Bank Accounts</span>
              {canAccess('bnk_reconciliation') && (
                <span className="text-[#8B3552] font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  Banking <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => canAccess('pay_runs') && onNavigate('pay_runs')}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors flex flex-col justify-between h-full group"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-slate-500 text-xs font-semibold">Payroll & Attendance</span>
            <Wallet className="w-4 h-4 text-[#8B3552] shrink-0" />
          </div>
          <div className="mt-3 w-full">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              ₹{payrollMetrics.latestNetPay.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between gap-2 text-xs mt-1.5 text-slate-500 tabular-nums">
              <span className="truncate">{attendanceBreakdown.counts.Present}/{attendanceBreakdown.total} Present</span>
              {canAccess('pay_runs') && (
                <span className="text-[#8B3552] font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  Payroll <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => canAccess('budgets_funds') && onNavigate('budgets_funds')}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-burgundy-300 transition-colors flex flex-col justify-between h-full group"
        >
          <div className="flex items-center justify-between w-full gap-2">
            <span className="text-slate-500 text-xs font-semibold">Budgets Utilization</span>
            <Coins className="w-4 h-4 text-[#C5A572] shrink-0" />
          </div>
          <div className="mt-3 w-full">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {budgetMetrics.pct}% Utilized
            </div>
            <div className="flex items-center justify-between gap-2 text-xs mt-1.5 text-slate-500 tabular-nums">
              <span className="truncate">₹{(budgetMetrics.spent / 100000).toFixed(1)}L / ₹{(budgetMetrics.allocated / 100000).toFixed(1)}L</span>
              {canAccess('budgets_funds') && (
                <span className="text-[#8B3552] font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  Budgets <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* 2. CHARTS ROW: Live Cross-Menu Financial Position Bar Chart + Live Fee Head Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Chart 1: Financial Position Across ERP Menus */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Financial Position Across Menus</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCompany.display_name} · {selectedFy.year_name} · Live totals synced with module ledgers
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-700 tabular-nums">
              {hoveredBarIdx !== null && modulePositionSeries[hoveredBarIdx] ? (
                <span>
                  {modulePositionSeries[hoveredBarIdx].menuTitle}: ₹
                  {modulePositionSeries[hoveredBarIdx].amount.toLocaleString('en-IN')}
                </span>
              ) : (
                <span>Click any bar to open module</span>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 640 235"
              className="w-full h-56 min-w-[480px]"
              role="img"
              aria-label="Financial position bar chart across ERP menus"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 185 - ratio * 155;
                const labelVal = Math.round((maxModuleVal * ratio) / 100000);
                return (
                  <g key={idx}>
                    <line
                      x1="46"
                      y1={y}
                      x2="625"
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={idx === 0 ? '0' : '3 3'}
                      strokeWidth="1"
                    />
                    <text x="38" y={y + 3} textAnchor="end" fontSize="10" fill="#64748B" className="tabular-nums">
                      ₹{labelVal}L
                    </text>
                  </g>
                );
              })}

              {modulePositionSeries.map((item, idx) => {
                const slotWidth = 570 / Math.max(1, modulePositionSeries.length);
                const barW = Math.min(34, Math.max(18, slotWidth * 0.52));
                const x = 56 + idx * slotWidth + (slotWidth - barW) / 2;
                const h = Math.max(6, (item.amount / maxModuleVal) * 155);
                const isHovered = hoveredBarIdx === idx;

                return (
                  <g
                    key={`${item.label}-${idx}`}
                    onMouseEnter={() => setHoveredBarIdx(idx)}
                    onMouseLeave={() => setHoveredBarIdx(null)}
                    onClick={() => onNavigate(item.menuId)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x - 6}
                      y={22}
                      width={barW + 12}
                      height={170}
                      rx={6}
                      fill={isHovered ? '#FDF2F5' : 'transparent'}
                    />
                    <rect
                      x={x}
                      y={185 - h}
                      width={barW}
                      height={h}
                      rx={4}
                      fill={item.color}
                      opacity={isHovered ? 1 : 0.9}
                    />
                    <text
                      x={x + barW / 2}
                      y={185 - h - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="#475569"
                      className="tabular-nums"
                    >
                      {(item.amount / 100000).toFixed(1)}L
                    </text>
                    <text
                      x={x + barW / 2}
                      y={204}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight={isHovered ? '700' : '500'}
                      fill={isHovered ? '#8B3552' : '#475569'}
                    >
                      {item.label.split(' ')[0]}
                    </text>
                    <text
                      x={x + barW / 2}
                      y={216}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight={isHovered ? '700' : '400'}
                      fill={isHovered ? '#8B3552' : '#64748B'}
                    >
                      {item.label.split(' ').slice(1).join(' ')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 tabular-nums">
              {vouchers.length} Vouchers · {invoices.length} Invoices · {MOCK_EMPLOYEES.length} Employees
            </span>
            {canAccess('rep_trial_balance') && (
              <button
                type="button"
                onClick={() => onNavigate('rep_trial_balance')}
                className="font-semibold text-[#8B3552] hover:underline whitespace-nowrap"
              >
                View Financial Reports →
              </button>
            )}
          </div>
        </div>

        {/* Chart 2: Student Fee Head Breakdown Donut (Derived directly from Fee Invoices) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Invoice Fee Head Split</h3>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                {invoices.length} Invoices · {MOCK_STUDENTS.length} Students
              </p>
            </div>
            {canAccess('sf_invoices') && (
              <button
                type="button"
                onClick={() => onNavigate('sf_invoices')}
                className="text-xs font-semibold text-[#8B3552] hover:underline whitespace-nowrap shrink-0"
              >
                Student Finance
              </button>
            )}
          </div>

          <div className="flex items-center justify-center py-1">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full" role="img" aria-label="Invoice breakdown by fee head">
                {feeBreakdownData.items.map((seg, idx) => {
                  const isActive = hoveredFeeIdx === idx;
                  return (
                    <path
                      key={seg.id}
                      d={describeArc(80, 80, 58, seg.startAngle, seg.endAngle - 2)}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={isActive ? 22 : 18}
                      strokeLinecap="butt"
                      onMouseEnter={() => setHoveredFeeIdx(idx)}
                      onMouseLeave={() => setHoveredFeeIdx(null)}
                      className="cursor-pointer transition-opacity"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[11px] font-semibold text-slate-500 truncate max-w-full">
                  {hoveredFeeIdx !== null ? feeBreakdownData.items[hoveredFeeIdx].code : 'Gross Billed'}
                </span>
                <span className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                  ₹{(hoveredFeeIdx !== null ? feeBreakdownData.items[hoveredFeeIdx].amount : feeBreakdownData.grandTotal).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-semibold text-[#8B3552] tabular-nums">
                  {hoveredFeeIdx !== null ? `${feeBreakdownData.items[hoveredFeeIdx].sharePct}% Share` : `${feeBreakdownData.items.length} Fee Heads`}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {feeBreakdownData.items.map((seg, idx) => (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredFeeIdx(idx)}
                onMouseLeave={() => setHoveredFeeIdx(null)}
                className={`flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors ${
                  hoveredFeeIdx === idx ? 'bg-[#FAF7F3]' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-slate-700 font-medium truncate">{seg.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 tabular-nums">
                  <span className="font-bold text-slate-900">₹{seg.amount.toLocaleString('en-IN')}</span>
                  <span className="text-slate-400 w-8 text-right">{seg.sharePct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. OPERATIONAL MODULES ROW: Budgets & Funds · Payroll & Attendance · Banking, Procurement, Tax & Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card A: Budgets & Funds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Budgets & Funds</h3>
              <p className="text-xs text-slate-500 mt-0.5">Spent vs Pending Commitments</p>
            </div>
            {canAccess('budgets_funds') && (
              <button
                type="button"
                onClick={() => onNavigate('budgets_funds')}
                className="text-xs font-semibold text-[#8B3552] hover:underline whitespace-nowrap shrink-0"
              >
                View Budgets
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {MOCK_BUDGETS.map(b => {
              const spentPct = Math.round((b.spent_amount / b.allocated_amount) * 100);
              const commitPct = Math.round((b.pending_commitments / b.allocated_amount) * 100);
              return (
                <div key={b.budget_id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 truncate">{b.category}</span>
                    <span className="font-bold text-slate-900 tabular-nums shrink-0">{spentPct + commitPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-[#8B3552] h-full" style={{ width: `${spentPct}%` }} />
                    <div className="bg-[#C5A572] h-full" style={{ width: `${commitPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                    <span>Spent ₹{(b.spent_amount / 100000).toFixed(2)}L</span>
                    <span>Allocated ₹{(b.allocated_amount / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card B: Payroll & Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payroll & Attendance</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {attendanceBreakdown.latestDate} · {payrollMetrics.latestMonth}
              </p>
            </div>
            {canAccess('pay_attendance') && (
              <button
                type="button"
                onClick={() => onNavigate('pay_attendance')}
                className="text-xs font-semibold text-[#8B3552] hover:underline whitespace-nowrap shrink-0"
              >
                Open Payroll
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Staff Attendance</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {attendanceBreakdown.counts.Present} / {attendanceBreakdown.total} Present
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div className="bg-emerald-600 h-full" style={{ width: `${(attendanceBreakdown.counts.Present / attendanceBreakdown.total) * 100}%` }} />
              <div className="bg-[#C5A572] h-full" style={{ width: `${(attendanceBreakdown.counts['Half Day'] / attendanceBreakdown.total) * 100}%` }} />
              <div className="bg-amber-500 h-full" style={{ width: `${(attendanceBreakdown.counts.Leave / attendanceBreakdown.total) * 100}%` }} />
              <div className="bg-rose-600 h-full" style={{ width: `${(attendanceBreakdown.counts.Absent / attendanceBreakdown.total) * 100}%` }} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Present</span>
                <span className="font-bold text-emerald-700 tabular-nums">{attendanceBreakdown.counts.Present}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Half Day</span>
                <span className="font-bold text-champagne-700 tabular-nums">{attendanceBreakdown.counts['Half Day']}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Leave</span>
                <span className="font-bold text-amber-700 tabular-nums">{attendanceBreakdown.counts.Leave}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Absent</span>
                <span className="font-bold text-rose-600 tabular-nums">{attendanceBreakdown.counts.Absent}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gross Salary ({payrollMetrics.employeeCount} Staff)</span>
              <span className="font-bold text-slate-900 tabular-nums">₹{payrollMetrics.latestGrossPay.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Net Disbursement</span>
              <span className="font-bold text-[#8B3552] tabular-nums">₹{payrollMetrics.latestNetPay.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Card C: Banking, Procurement, Tax & Fixed Assets Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Module Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live balances across Banking, Procurement, Tax & Assets</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {canAccess('bnk_reconciliation') && (
              <button
                type="button"
                onClick={() => onNavigate('bnk_reconciliation')}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Landmark className="w-4 h-4 text-[#8B3552] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">Banking</div>
                    <div className="text-[11px] text-slate-500 truncate">{MOCK_BANK_ACCOUNTS.length} Accounts · Reconciled</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  ₹{(bankMetrics.totalBalance / 100000).toFixed(2)} L
                </span>
              </button>
            )}

            {canAccess('prc_bills') && (
              <button
                type="button"
                onClick={() => onNavigate('prc_bills')}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShoppingBag className="w-4 h-4 text-[#C5A572] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">Procurement</div>
                    <div className="text-[11px] text-slate-500 truncate">{vendorPayables.vendorCount} Vendors · {vendorPayables.billCount} Bill</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  ₹{vendorPayables.openAmount.toLocaleString('en-IN')}
                </span>
              </button>
            )}

            {canAccess('tax_rules') && (
              <button
                type="button"
                onClick={() => onNavigate('tax_rules')}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCheck className="w-4 h-4 text-[#8B3552] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">Tax & Compliance</div>
                    <div className="text-[11px] text-slate-500 truncate">GST & TDS Statutory Rules</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">{MOCK_TAX_RULES.length} Active</span>
              </button>
            )}

            {canAccess('inventory_assets') && (
              <button
                type="button"
                onClick={() => onNavigate('inventory_assets')}
                className="w-full py-2.5 flex items-center justify-between gap-3 text-left hover:bg-[#FAF7F3] px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package className="w-4 h-4 text-[#C5A572] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">Inventory & Assets</div>
                    <div className="text-[11px] text-slate-500 truncate">{MOCK_FIXED_ASSETS.length} Fixed Assets</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  ₹{(assetBookTotal / 100000).toFixed(2)} L
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ACTIVITY & APPROVALS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Accounting Vouchers & Audit Logs Switcher */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 h-full space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#FAF7F3] border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setActivityTab('vouchers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activityTab === 'vouchers'
                    ? 'bg-[#8B3552] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Accounting Vouchers ({vouchers.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityTab('audit')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activityTab === 'audit'
                    ? 'bg-[#8B3552] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit Logs ({auditLogs.length})
              </button>
            </div>

            {canAccess(activityTab === 'vouchers' ? 'acc_vouchers' : 'audit_logs') && (
              <button
                type="button"
                onClick={() => onNavigate(activityTab === 'vouchers' ? 'acc_vouchers' : 'audit_logs')}
                className="text-xs font-semibold text-[#8B3552] hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>{activityTab === 'vouchers' ? 'Open Accounting' : 'Open Audit Logs'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activityTab === 'vouchers' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="pb-2.5">Voucher #</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5">Narration</th>
                    <th className="pb-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vouchers.slice(0, 5).map(v => (
                    <tr key={v.voucher_id} className="hover:bg-[#FAF7F3]/70 transition-colors">
                      <td className="py-3 font-mono font-semibold text-[#8B3552] whitespace-nowrap">{v.voucher_number}</td>
                      <td className="py-3 whitespace-nowrap text-slate-700 font-medium">{v.voucher_type_id}</td>
                      <td className="py-3 text-slate-500 tabular-nums whitespace-nowrap">{v.voucher_date}</td>
                      <td className="py-3 max-w-[260px] truncate text-slate-600">{v.narration}</td>
                      <td className="py-3 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        ₹{v.total_debit.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                    <th className="pb-2.5">Timestamp</th>
                    <th className="pb-2.5">Actor</th>
                    <th className="pb-2.5">Module</th>
                    <th className="pb-2.5">Action</th>
                    <th className="pb-2.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.slice(0, 5).map(log => (
                    <tr key={log.audit_log_id} className="hover:bg-[#FAF7F3]/70 transition-colors">
                      <td className="py-3 font-mono text-slate-500 tabular-nums whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 font-semibold text-slate-900 whitespace-nowrap">{log.user_name}</td>
                      <td className="py-3 text-slate-700 whitespace-nowrap">{log.module}</td>
                      <td className="py-3 font-mono font-semibold text-[#8B3552] whitespace-nowrap">{log.action_type}</td>
                      <td className="py-3 max-w-[240px] truncate text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Approvals (Linked to Approvals Menu) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between h-full space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Approvals</h3>
              <p className="text-xs text-slate-500">Pending maker-checker items</p>
            </div>
            {canAccess('approvals') && (
              <button
                type="button"
                onClick={() => onNavigate('approvals')}
                className="text-xs font-semibold text-[#8B3552] hover:underline whitespace-nowrap"
              >
                Open Approvals
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 text-xs flex-1">
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">Vendor Bill #998 · ABC Supplies</div>
                <div className="text-slate-500 text-[11px] tabular-nums">Purchase · ₹1,00,000</div>
              </div>
              <button
                type="button"
                onClick={() => canAccess('approvals') && onNavigate('approvals')}
                className="px-3 py-1.5 bg-[#8B3552] text-white font-semibold rounded-lg hover:bg-[#722B43] transition-colors whitespace-nowrap shrink-0"
              >
                Review
              </button>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">Nov Payroll Batch (#RUN-2026-11)</div>
                <div className="text-slate-500 text-[11px] tabular-nums">Payroll · ₹2,46,500</div>
              </div>
              <button
                type="button"
                onClick={() => canAccess('approvals') && onNavigate('approvals')}
                className="px-3 py-1.5 bg-[#8B3552] text-white font-semibold rounded-lg hover:bg-[#722B43] transition-colors whitespace-nowrap shrink-0"
              >
                Review
              </button>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">Merit Scholarship Waiver (Aadhavan K)</div>
                <div className="text-slate-500 text-[11px] tabular-nums">Fee · ₹15,000</div>
              </div>
              <button
                type="button"
                onClick={() => canAccess('approvals') && onNavigate('approvals')}
                className="px-3 py-1.5 bg-[#8B3552] text-white font-semibold rounded-lg hover:bg-[#722B43] transition-colors whitespace-nowrap shrink-0"
              >
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
