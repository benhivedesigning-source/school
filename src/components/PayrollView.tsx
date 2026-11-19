import React, { useState } from 'react';
import { Employee, PayrollRun, AttendanceRecord, Branch } from '../types';
import { AttendanceView } from './AttendanceView';

interface PayrollViewProps {
  employees: Employee[];
  payrollRuns: PayrollRun[];
  attendanceRecords?: AttendanceRecord[];
  onAddAttendance?: (record: AttendanceRecord) => void;
  onUpdateAttendance?: (record: AttendanceRecord) => void;
  onBulkAddAttendance?: (records: AttendanceRecord[]) => void;
  branches?: Branch[];
  currentRole?: string;
  initialTab?: 'employees' | 'attendance' | 'runs' | 'structures' | 'payslips';
  isReadOnly?: boolean;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  employees,
  payrollRuns,
  attendanceRecords = [],
  onAddAttendance = () => {},
  onUpdateAttendance = () => {},
  onBulkAddAttendance = () => {},
  branches = [],
  currentRole = 'Admin',
  initialTab = 'employees',
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'runs' | 'structures' | 'payslips'>(initialTab);
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const sectionControls = (
    <select
      aria-label="Payroll Section"
      value={activeTab}
      onChange={(e) => setActiveTab(e.target.value as 'employees' | 'attendance' | 'runs' | 'structures' | 'payslips')}
      className="bg-[#FAF7F3] border border-burgundy-200 rounded-xl px-3.5 py-2 text-xs font-bold text-burgundy-900 focus:outline-none focus:border-[#8B3552] cursor-pointer shrink-0"
    >
      <option value="employees">Employees ({employees.length})</option>
      <option value="attendance">Attendance Register (Live)</option>
      <option value="runs">Payroll Runs ({payrollRuns.length})</option>
      <option value="structures">Salary Structures</option>
      <option value="payslips">Payslips</option>
    </select>
  );

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Faculty & Staff Employee Directory</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Active personnel enrolled in monthly salary payroll · Total {employees.length} faculty members</p>
            </div>
            {sectionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Employee Code</th>
                  <th className="pb-3.5">Employee Name & Email</th>
                  <th className="pb-3.5">Designation</th>
                  <th className="pb-3.5">Joining Date</th>
                  <th className="pb-3.5 text-right">Gross Salary (₹)</th>
                  <th className="pb-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employees.map(emp => (
                  <tr key={emp.employee_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-4 font-mono font-bold text-burgundy-700">{emp.employee_code}</td>
                    <td className="py-4">
                      <div className="font-bold text-slate-900 text-sm">{emp.employee_name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{emp.email || `${emp.employee_code.toLowerCase()}@greenvalley.edu`}</div>
                    </td>
                    <td className="py-4 font-medium text-slate-700">{emp.designation || 'Academic Faculty'}</td>
                    <td className="py-4 text-slate-500 font-medium">{emp.joining_date}</td>
                    <td className="py-4 text-right font-bold text-slate-900 tabular-nums">₹{emp.gross_salary.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {emp.employee_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Tab (Full AttendanceView rendered here) */}
      {activeTab === 'attendance' && (
        <AttendanceView
          attendanceRecords={attendanceRecords}
          onAddAttendance={onAddAttendance}
          onUpdateAttendance={onUpdateAttendance}
          onBulkAddAttendance={onBulkAddAttendance}
          employees={employees}
          branches={branches}
          currentRole={currentRole}
          isReadOnly={isReadOnly}
          sectionSelector={sectionControls}
        />
      )}

      {/* Payroll Runs Tab */}
      {activeTab === 'runs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Payroll Runs</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Calculated payable days synced with monthly attendance register</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {sectionControls}
              <button
                onClick={() => alert('New Payroll Run initiated for November 2026. Payable days synced from attendance.')}
                className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition whitespace-nowrap shrink-0"
              >
                + Run Payroll
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3.5">Payroll Month</th>
                  <th className="pb-3.5">Staff Count</th>
                  <th className="pb-3.5 text-right">Gross Earnings (₹)</th>
                  <th className="pb-3.5 text-right">Deductions (₹)</th>
                  <th className="pb-3.5 text-right">Net Pay (₹)</th>
                  <th className="pb-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payrollRuns.map(pr => (
                  <tr key={pr.payroll_run_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                    <td className="py-4 font-bold text-slate-900 text-sm">{pr.month_name}</td>
                    <td className="py-4 font-semibold text-slate-600 tabular-nums">{pr.employee_count} Employees</td>
                    <td className="py-4 text-right font-medium text-slate-700 tabular-nums">₹{pr.gross_earnings.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-right font-medium text-rose-600 tabular-nums">₹{pr.employee_deductions.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-right font-bold text-burgundy-800 text-sm tabular-nums">₹{pr.net_pay.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pr.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Structures Tab */}
      {activeTab === 'structures' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Salary Components & Pay Scale Matrices</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Basic pay, DA, HRA, PF, and Professional Tax formulas</p>
            </div>
            {sectionControls}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Teaching Faculty Scale A</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">Active</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Basic Pay:</span> <strong className="text-slate-800">50% of CTC</strong></div>
                <div className="flex justify-between"><span>House Rent Allowance (HRA):</span> <strong className="text-slate-800">20% of Basic</strong></div>
                <div className="flex justify-between"><span>Dearness Allowance (DA):</span> <strong className="text-slate-800">15% of Basic</strong></div>
                <div className="flex justify-between"><span>Provident Fund (PF):</span> <strong className="text-rose-600">12% Deduction</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF7F3] border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Administrative Staff Scale B</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-burgundy-50 text-burgundy-700 border border-burgundy-200">Active</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Basic Pay:</span> <strong className="text-slate-800">55% of CTC</strong></div>
                <div className="flex justify-between"><span>House Rent Allowance (HRA):</span> <strong className="text-slate-800">18% of Basic</strong></div>
                <div className="flex justify-between"><span>Special Allowance:</span> <strong className="text-slate-800">Fixed ₹5,000</strong></div>
                <div className="flex justify-between"><span>Provident Fund (PF):</span> <strong className="text-rose-600">12% Deduction</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payslips Tab */}
      {activeTab === 'payslips' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Generated Monthly Payslips</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Faculty salary slips with attendance deductions and tax computation</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {sectionControls}
              <button
                onClick={() => alert('Bulk payslips generated and sent to staff portal/email.')}
                className="px-3.5 py-2 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition whitespace-nowrap shrink-0"
              >
                Download All Payslips (PDF)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(emp => (
              <div key={emp.employee_id} className="p-4 rounded-xl border border-slate-200 bg-[#FAF7F3]/60 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{emp.employee_name}</h4>
                    <span className="font-mono text-burgundy-700 text-xs font-semibold">{emp.employee_code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Paid
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-200/60 font-medium">
                  <div className="flex justify-between"><span>Month:</span> <strong className="text-slate-800">October 2026</strong></div>
                  <div className="flex justify-between"><span>Net Salary:</span> <strong className="text-slate-900 font-bold tabular-nums">₹{(emp.gross_salary * 0.92).toLocaleString('en-IN')}</strong></div>
                  <div className="flex justify-between"><span>Working Days:</span> <strong className="text-slate-800">30 / 30 Days</strong></div>
                </div>
                <button
                  onClick={() => alert(`Official Payslip generated for ${emp.employee_name} for October 2026.`)}
                  className="w-full mt-2 py-1.5 text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-50 border border-burgundy-200 rounded-lg transition"
                >
                  View / Print Slip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
