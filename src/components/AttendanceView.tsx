import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Coffee, 
  Download, 
  Upload, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit3, 
  Check, 
  X, 
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Employee, Branch } from '../types';

interface AttendanceViewProps {
  attendanceRecords: AttendanceRecord[];
  onAddAttendance: (record: AttendanceRecord) => void;
  onUpdateAttendance: (record: AttendanceRecord) => void;
  onBulkAddAttendance?: (records: AttendanceRecord[]) => void;
  employees: Employee[];
  branches: Branch[];
  currentRole: string;
  isReadOnly?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canImport?: boolean;
  canExport?: boolean;
  canPrint?: boolean;
  initialViewMode?: 'daily' | 'register';
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceRecords,
  onAddAttendance,
  onUpdateAttendance,
  onBulkAddAttendance,
  employees,
  branches,
  currentRole,
  isReadOnly = false,
  canCreate = true,
  canEdit = true,
  canImport = true,
  canExport = true,
  canPrint = true,
  initialViewMode = 'daily'
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'register' | 'details'>(initialViewMode);
  React.useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-17');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showMarkModal, setShowMarkModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // New Record Form State
  const [formEmployeeId, setFormEmployeeId] = useState<string>(employees[0]?.employee_id || '');
  const [formDate, setFormDate] = useState<string>(selectedDate);
  const [formStatus, setFormStatus] = useState<AttendanceStatus>('Present');
  const [formCheckIn, setFormCheckIn] = useState<string>('08:30');
  const [formCheckOut, setFormCheckOut] = useState<string>('16:30');
  const [formRemarks, setFormRemarks] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Bulk Form State
  const [bulkDate, setBulkDate] = useState<string>(selectedDate);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('Present');
  const [bulkSelectedEmpIds, setBulkSelectedEmpIds] = useState<string[]>(employees.map(e => e.employee_id));
  const [bulkRemarks, setBulkRemarks] = useState<string>('Bulk logged for working shift');

  // Import CSV state
  const [importStep, setImportStep] = useState<'upload' | 'preview'>('upload');
  const [importFileName, setImportFileName] = useState<string>('');
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);

  // Filtered records for daily view
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(rec => {
      const matchDate = viewMode === 'register' ? true : rec.attendance_date === selectedDate;
      const matchBranch = selectedBranch === 'all' || rec.branch_id === selectedBranch;
      const matchDept = selectedDepartment === 'all' || rec.department.toLowerCase().includes(selectedDepartment.toLowerCase());
      const matchStatus = selectedStatus === 'all' || rec.status === selectedStatus;
      const matchSearch = searchQuery.trim() === '' || 
        rec.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.employee_code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDate && matchBranch && matchDept && matchStatus && matchSearch;
    });
  }, [attendanceRecords, selectedDate, selectedBranch, selectedDepartment, selectedStatus, searchQuery, viewMode]);

  // Daily Counts based on selected date and branch
  const stats = useMemo(() => {
    const dayRecords = attendanceRecords.filter(r => r.attendance_date === selectedDate && (selectedBranch === 'all' || r.branch_id === selectedBranch));
    return {
      total: employees.length,
      present: dayRecords.filter(r => r.status === 'Present').length,
      absent: dayRecords.filter(r => r.status === 'Absent').length,
      halfDay: dayRecords.filter(r => r.status === 'Half Day').length,
      leave: dayRecords.filter(r => r.status === 'Leave').length,
      holiday: dayRecords.filter(r => r.status === 'Holiday').length,
      marked: dayRecords.length
    };
  }, [attendanceRecords, selectedDate, selectedBranch, employees]);

  // Calculate worked hours helper
  const calculateWorkedHours = (inTime?: string, outTime?: string): number | undefined => {
    if (!inTime || !outTime) return undefined;
    const [inH, inM] = inTime.split(':').map(Number);
    const [outH, outM] = outTime.split(':').map(Number);
    let diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // handle overnight
    return parseFloat((diffMinutes / 60).toFixed(2));
  };

  // Save Single Record
  const handleSaveAttendance = () => {
    setFormError('');
    if (!formEmployeeId) {
      setFormError('Please select an employee');
      return;
    }
    if (!formDate) {
      setFormError('Please specify attendance date');
      return;
    }

    // Check duplicate for same employee and same date
    const isDuplicate = attendanceRecords.some(r => 
      r.employee_id === formEmployeeId && 
      r.attendance_date === formDate && 
      (!editingRecord || r.attendance_id !== editingRecord.attendance_id)
    );

    if (isDuplicate) {
      setFormError(`An attendance record already exists for this employee on ${formDate}. Use edit to modify.`);
      return;
    }

    const emp = employees.find(e => e.employee_id === formEmployeeId);
    const br = branches.find(b => b.branch_id === emp?.branch_id) || branches[0];
    const workedHours = (formStatus === 'Present' || formStatus === 'Half Day') 
      ? calculateWorkedHours(formCheckIn, formCheckOut) 
      : undefined;

    if (editingRecord) {
      const updated: AttendanceRecord = {
        ...editingRecord,
        status: formStatus,
        check_in_time: formStatus === 'Absent' || formStatus === 'Leave' || formStatus === 'Holiday' ? undefined : formCheckIn,
        check_out_time: formStatus === 'Absent' || formStatus === 'Leave' || formStatus === 'Holiday' ? undefined : formCheckOut,
        worked_hours: workedHours,
        remarks: formRemarks,
        last_updated_by: `${currentRole} Admin`,
        last_updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      onUpdateAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        attendance_id: `att-${Date.now()}`,
        employee_id: formEmployeeId,
        employee_code: emp?.employee_code || 'EMP-100',
        employee_name: emp?.employee_name || 'Staff Member',
        branch_id: emp?.branch_id || 'branch-01',
        branch_name: br.branch_name,
        department: emp?.department_id || 'General Staff',
        attendance_date: formDate,
        status: formStatus,
        check_in_time: formStatus === 'Absent' || formStatus === 'Leave' || formStatus === 'Holiday' ? undefined : formCheckIn,
        check_out_time: formStatus === 'Absent' || formStatus === 'Leave' || formStatus === 'Holiday' ? undefined : formCheckOut,
        worked_hours: workedHours,
        remarks: formRemarks,
        last_updated_by: `${currentRole} Admin`,
        last_updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      onAddAttendance(newRec);
    }

    setShowMarkModal(false);
    setEditingRecord(null);
  };

  // Bulk Save
  const handleSaveBulkAttendance = () => {
    if (bulkSelectedEmpIds.length === 0) return;
    const recordsToAdd: AttendanceRecord[] = [];

    bulkSelectedEmpIds.forEach(empId => {
      // Skip if already marked for that day
      const exists = attendanceRecords.some(r => r.employee_id === empId && r.attendance_date === bulkDate);
      if (!exists) {
        const emp = employees.find(e => e.employee_id === empId);
        const br = branches.find(b => b.branch_id === emp?.branch_id) || branches[0];
        recordsToAdd.push({
          attendance_id: `att-${Date.now()}-${empId}`,
          employee_id: empId,
          employee_code: emp?.employee_code || 'EMP-100',
          employee_name: emp?.employee_name || 'Staff Member',
          branch_id: emp?.branch_id || 'branch-01',
          branch_name: br.branch_name,
          department: emp?.department_id || 'General Staff',
          attendance_date: bulkDate,
          status: bulkStatus,
          check_in_time: bulkStatus === 'Present' ? '08:30' : undefined,
          check_out_time: bulkStatus === 'Present' ? '16:30' : undefined,
          worked_hours: bulkStatus === 'Present' ? 8.0 : undefined,
          remarks: bulkRemarks,
          last_updated_by: `${currentRole} Admin`,
          last_updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    });

    if (recordsToAdd.length > 0) {
      if (onBulkAddAttendance) {
        onBulkAddAttendance(recordsToAdd);
      } else {
        recordsToAdd.forEach(r => onAddAttendance(r));
      }
    }
    setShowBulkModal(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Employee Code', 'Employee Name', 'Branch', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Worked Hours', 'Remarks', 'Last Updated By', 'Last Updated Time'];
    const rows = filteredRecords.map(r => [
      r.employee_code,
      `"${r.employee_name}"`,
      `"${r.branch_name}"`,
      `"${r.department}"`,
      r.attendance_date,
      r.status,
      r.check_in_time || '',
      r.check_out_time || '',
      r.worked_hours || '',
      `"${r.remarks || ''}"`,
      `"${r.last_updated_by}"`,
      r.last_updated_time
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  // Simulated Import File
  const handleSimulatedImportFile = () => {
    setImportFileName('November_Attendance_Biometric_Feed.csv');
    setImportPreviewData([
      { employee_code: 'EMP-101', name: 'Suresh Kumar', date: '2026-11-18', status: 'Present', in: '08:28', out: '16:32', hours: 8.07, validation: 'Valid' },
      { employee_code: 'EMP-102', name: 'Lakshmi Priya', date: '2026-11-18', status: 'Present', in: '08:35', out: '16:30', hours: 7.92, validation: 'Valid' },
      { employee_code: 'EMP-103', name: 'Karthik V.', date: '2026-11-18', status: 'Present', in: '08:15', out: '17:00', hours: 8.75, validation: 'Valid' },
      { employee_code: 'EMP-104', name: 'Anjali Menon', date: '2026-11-18', status: 'Leave', in: '', out: '', hours: '', validation: 'Valid (Casual Leave)' },
      { employee_code: 'EMP-105', name: 'Manoj Pillai', date: '2026-11-18', status: 'Present', in: '08:45', out: '16:30', hours: 7.75, validation: 'Valid' }
    ]);
    setImportStep('preview');
  };

  // Complete Import
  const handleConfirmImport = () => {
    importPreviewData.forEach(row => {
      const emp = employees.find(e => e.employee_code === row.employee_code);
      if (emp) {
        onAddAttendance({
          attendance_id: `att-imp-${Date.now()}-${row.employee_code}`,
          employee_id: emp.employee_id,
          employee_code: row.employee_code,
          employee_name: row.name,
          branch_id: emp.branch_id,
          branch_name: 'Chennai Main Campus',
          department: emp.department_id,
          attendance_date: row.date,
          status: row.status as AttendanceStatus,
          check_in_time: row.in || undefined,
          check_out_time: row.out || undefined,
          worked_hours: row.hours ? Number(row.hours) : undefined,
          remarks: 'Imported via Biometric CSV Feed',
          last_updated_by: `${currentRole} (CSV Import)`,
          last_updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    });
    setShowImportModal(false);
    setImportStep('upload');
  };

  const actionControls = (
    <div className="flex flex-wrap items-center gap-2 shrink-0">

      {isReadOnly && (
        <div className="flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 whitespace-nowrap shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">Read-Only</span>
        </div>
      )}

      {canCreate && !isReadOnly && (
        <>
          <button
            onClick={() => {
              setEditingRecord(null);
              setFormEmployeeId(employees[0]?.employee_id || '');
              setFormDate(selectedDate);
              setFormStatus('Present');
              setFormCheckIn('08:30');
              setFormCheckOut('16:30');
              setFormRemarks('');
              setFormError('');
              setShowMarkModal(true);
            }}
            className="px-3 py-1.5 bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => {
              setBulkDate(selectedDate);
              setBulkStatus('Present');
              setBulkSelectedEmpIds(employees.map(e => e.employee_id));
              setShowBulkModal(true);
            }}
            className="px-3 py-1.5 bg-white hover:bg-[#FAF7F3] text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-burgundy-600 shrink-0" />
            <span>Bulk Mark</span>
          </button>
        </>
      )}

      {canImport && !isReadOnly && (
        <button
          onClick={() => {
            setImportStep('upload');
            setImportFileName('');
            setShowImportModal(true);
          }}
          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F3] text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          title="Import Biometric CSV Feed"
        >
          <Upload className="w-3.5 h-3.5 text-champagne-600 shrink-0" />
          <span>Import CSV</span>
        </button>
      )}

      {canExport && (
        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F3] text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          title="Export Attendance to CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Export</span>
        </button>
      )}

      {canPrint && (
        <button
          onClick={handlePrint}
          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F3] text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5 whitespace-nowrap shrink-0"
          title="Print Summary Sheet"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Print</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Staff</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">{stats.total}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Active roster</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Present</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1 tabular-nums">{stats.present}</div>
          <div className="text-[10px] text-emerald-600 font-medium">On campus</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="text-rose-700 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Absent</span>
          </div>
          <div className="text-xl font-extrabold text-rose-700 mt-1 tabular-nums">{stats.absent}</div>
          <div className="text-[10px] text-rose-600 font-medium">Unexcused</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="text-amber-700 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Half Day</span>
          </div>
          <div className="text-xl font-extrabold text-amber-700 mt-1 tabular-nums">{stats.halfDay}</div>
          <div className="text-[10px] text-amber-600 font-medium">4 hrs recorded</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="text-blue-700 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Leave</span>
          </div>
          <div className="text-xl font-extrabold text-blue-700 mt-1 tabular-nums">{stats.leave}</div>
          <div className="text-[10px] text-blue-600 font-medium">Approved leaves</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
            <Coffee className="w-3 h-3 text-slate-400" />
            <span>Holiday</span>
          </div>
          <div className="text-xl font-extrabold text-slate-700 mt-1 tabular-nums">{stats.holiday}</div>
          <div className="text-[10px] text-slate-500 font-medium">Scheduled off</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker (for Daily view) */}
          {viewMode === 'daily' && (
            <div className="flex items-center space-x-2">
              <label className="font-semibold text-slate-600">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
              />
            </div>
          )}

          {/* Branch Filter */}
          <div className="flex items-center space-x-2">
            <label className="font-semibold text-slate-600">Campus:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
            >
              <option value="all">All Campuses</option>
              {branches.map(b => (
                <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="font-semibold text-slate-600">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF7F3] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-burgundy-500"
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">Leave</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F3] border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 text-xs font-medium focus:outline-none focus:border-burgundy-500"
          />
        </div>
      </div>

      {/* DAILY ATTENDANCE VIEW */}
      {viewMode === 'daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-[#FAF7F3]/50">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Attendance Records for {selectedDate} ({filteredRecords.length} found)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Showing verified time-logs and check-in/out stamps</p>
            </div>
            {actionControls}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-[#FAF7F3]/80">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Campus & Dept</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Check-In</th>
                  <th className="py-3 px-3">Check-Out</th>
                  <th className="py-3 px-3 text-right">Worked Hours</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div className="font-semibold text-slate-600">No attendance records found for this date.</div>
                      <div className="text-[11px] text-slate-400 mt-1">Click "Mark Attendance" or "Bulk Mark" to log today's shift.</div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(rec => (
                    <tr key={rec.attendance_id} className="hover:bg-[#FAF7F3]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{rec.employee_name}</div>
                        <div className="text-[11px] text-burgundy-700 font-mono font-semibold">{rec.employee_code}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 font-medium">{rec.branch_name}</div>
                        <div className="text-[11px] text-slate-400">{rec.department}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          rec.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'Absent'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : rec.status === 'Half Day'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : rec.status === 'Leave'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {rec.status === 'Present' && <Check className="w-2.5 h-2.5" />}
                          {rec.status === 'Absent' && <X className="w-2.5 h-2.5" />}
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-800">
                        {rec.check_in_time || '-'}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-slate-800">
                        {rec.check_out_time || '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                        {rec.worked_hours !== undefined ? `${rec.worked_hours} hrs` : '-'}
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-500 font-medium">
                        {rec.remarks || 'Standard working day'}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRecord(rec);
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="View Record Details"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {canEdit && !isReadOnly && (
                            <button
                              onClick={() => {
                                setEditingRecord(rec);
                                setFormEmployeeId(rec.employee_id);
                                setFormDate(rec.attendance_date);
                                setFormStatus(rec.status);
                                setFormCheckIn(rec.check_in_time || '08:30');
                                setFormCheckOut(rec.check_out_time || '16:30');
                                setFormRemarks(rec.remarks || '');
                                setShowMarkModal(true);
                              }}
                              className="p-1.5 rounded-lg text-burgundy-600 hover:text-burgundy-900 hover:bg-burgundy-50 transition"
                              title="Edit Attendance"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MONTHLY ATTENDANCE REGISTER */}
      {viewMode === 'register' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Attendance Register (November 2026)</h3>
              <div className="flex flex-wrap items-center gap-3 text-[11px] mt-1 text-slate-600">
                <span className="flex items-center space-x-1 whitespace-nowrap"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> <span>P (Present)</span></span>
                <span className="flex items-center space-x-1 whitespace-nowrap"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> <span>A (Absent)</span></span>
                <span className="flex items-center space-x-1 whitespace-nowrap"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> <span>HD (Half Day)</span></span>
                <span className="flex items-center space-x-1 whitespace-nowrap"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> <span>L (Leave)</span></span>
                <span className="flex items-center space-x-1 whitespace-nowrap"><span className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></span> <span>H (Holiday)</span></span>
              </div>
            </div>
            {actionControls}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-[#FAF7F3] border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 text-left w-48">Employee Name</th>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(day => (
                    <th key={day} className="py-2 px-1.5 font-mono text-[10px] w-8">
                      {day}
                    </th>
                  ))}
                  <th className="py-2.5 px-2 text-right">Present</th>
                  <th className="py-2.5 px-2 text-right">Absent</th>
                  <th className="py-2.5 px-2 text-right">Payable Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const empLogs = attendanceRecords.filter(r => r.employee_id === emp.employee_id);
                  const presentCount = empLogs.filter(r => r.status === 'Present').length;
                  const absentCount = empLogs.filter(r => r.status === 'Absent').length;
                  const halfDayCount = empLogs.filter(r => r.status === 'Half Day').length;
                  const payableDays = presentCount + (halfDayCount * 0.5) + (30 - 15); // simulated for current period
                  return (
                    <tr key={emp.employee_id} className="hover:bg-[#FAF7F3]/60">
                      <td className="py-3 px-3 text-left">
                        <div className="font-bold text-slate-900">{emp.employee_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{emp.employee_code}</div>
                      </td>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(day => {
                        const dayStr = `2026-11-${day < 10 ? '0' + day : day}`;
                        const log = empLogs.find(r => r.attendance_date === dayStr);
                        let badgeBg = 'bg-slate-100 text-slate-400';
                        let char = '-';
                        if (log) {
                          if (log.status === 'Present') { badgeBg = 'bg-emerald-100 text-emerald-800 font-bold'; char = 'P'; }
                          else if (log.status === 'Absent') { badgeBg = 'bg-rose-100 text-rose-800 font-bold'; char = 'A'; }
                          else if (log.status === 'Half Day') { badgeBg = 'bg-amber-100 text-amber-800 font-bold'; char = 'HD'; }
                          else if (log.status === 'Leave') { badgeBg = 'bg-blue-100 text-blue-800 font-bold'; char = 'L'; }
                          else if (log.status === 'Holiday') { badgeBg = 'bg-slate-200 text-slate-700'; char = 'H'; }
                        } else {
                          // Default regular attendance mock for past days
                          if (day % 7 === 0) { badgeBg = 'bg-slate-200 text-slate-600'; char = 'H'; }
                          else { badgeBg = 'bg-emerald-50 text-emerald-700'; char = 'P'; }
                        }
                        return (
                          <td key={day} className="py-2 px-1">
                            <span className={`inline-block w-6 h-6 leading-6 text-[10px] rounded-md ${badgeBg}`}>
                              {char}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-3 px-2 text-right font-bold text-emerald-700 tabular-nums">14</td>
                      <td className="py-3 px-2 text-right font-bold text-rose-600 tabular-nums">{absentCount}</td>
                      <td className="py-3 px-2 text-right font-extrabold text-slate-900 tabular-nums">{payableDays.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MARK ATTENDANCE MODAL (SINGLE RECORD) */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingRecord ? 'Edit Attendance Record' : 'Mark Daily Attendance'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Record faculty check-in, shift hours, and compliance remarks.
                </p>
              </div>
              <button 
                onClick={() => setShowMarkModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee</label>
                <select
                  value={formEmployeeId}
                  disabled={!!editingRecord}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 disabled:opacity-75"
                >
                  {employees.map(e => (
                    <option key={e.employee_id} value={e.employee_id}>
                      {e.employee_name} ({e.employee_code} - {e.designation || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Attendance Date</label>
                  <input
                    type="date"
                    value={formDate}
                    disabled={!!editingRecord}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500 disabled:opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AttendanceStatus)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-burgundy-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Leave">Leave</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
              </div>

              {(formStatus === 'Present' || formStatus === 'Half Day') && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F3] rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Check-in Time (24h)</label>
                    <input
                      type="time"
                      value={formCheckIn}
                      onChange={(e) => setFormCheckIn(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Check-out Time (24h)</label>
                    <input
                      type="time"
                      value={formCheckOut}
                      onChange={(e) => setFormCheckOut(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-burgundy-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remarks & Observations</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved by principal, late check-in excused, duty leave for exam..."
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:outline-none focus:border-burgundy-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowMarkModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 rounded-xl bg-[#8B3552] hover:bg-[#722B43] text-white font-semibold shadow-xs transition"
              >
                {editingRecord ? 'Update Record' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK MARK MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bulk Mark Shift Attendance</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Quickly mark entire department or selected faculty members</p>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Set Status</label>
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value as AttendanceStatus)}
                    className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  >
                    <option value="Present">Present (Standard Shift 8.0h)</option>
                    <option value="Holiday">Holiday (School Closed)</option>
                    <option value="Half Day">Half Day (4.0h)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-700 font-semibold">Select Employees ({bulkSelectedEmpIds.length}/{employees.length})</label>
                  <button
                    onClick={() => {
                      if (bulkSelectedEmpIds.length === employees.length) setBulkSelectedEmpIds([]);
                      else setBulkSelectedEmpIds(employees.map(e => e.employee_id));
                    }}
                    className="text-burgundy-700 text-[11px] font-bold hover:underline"
                  >
                    {bulkSelectedEmpIds.length === employees.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-[#FAF7F3]">
                  {employees.map(emp => {
                    const isChecked = bulkSelectedEmpIds.includes(emp.employee_id);
                    return (
                      <label key={emp.employee_id} className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-white cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setBulkSelectedEmpIds(bulkSelectedEmpIds.filter(id => id !== emp.employee_id));
                            else setBulkSelectedEmpIds([...bulkSelectedEmpIds, emp.employee_id]);
                          }}
                          className="rounded text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <div className="flex-1 flex justify-between">
                          <span className="font-bold text-slate-800">{emp.employee_name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{emp.employee_code}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={bulkRemarks}
                  onChange={(e) => setBulkRemarks(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button onClick={() => setShowBulkModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                Cancel
              </button>
              <button onClick={handleSaveBulkAttendance} className="px-5 py-2 rounded-xl bg-[#8B3552] text-white font-semibold shadow-xs">
                Apply Bulk Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Import Biometric / CSV Attendance Feed</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Ingest time logs from biometric turnstiles or external scanners</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {importStep === 'upload' ? (
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center hover:border-burgundy-500 transition cursor-pointer bg-[#FAF7F3]/50"
                  onClick={handleSimulatedImportFile}
                >
                  <Upload className="w-10 h-10 mx-auto text-burgundy-600 mb-2" />
                  <div className="font-bold text-slate-800 text-sm">Click to select attendance CSV file</div>
                  <p className="text-slate-500 text-xs mt-1">Supports biometric punch export (CSV, XLS)</p>
                  <span className="inline-block mt-3 px-3 py-1 rounded-md bg-burgundy-50 text-burgundy-700 text-xs font-semibold border border-burgundy-200">
                    Load Sample Biometric Feed
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#FAF7F3] rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">Need the official schema template?</span>
                  </div>
                  <button
                    onClick={() => {
                      const csvHeader = 'employee_code,attendance_date,status,check_in_time,check_out_time,remarks\nEMP-101,2026-11-18,Present,08:30,16:30,Standard shift\n';
                      const blob = new Blob([csvHeader], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.setAttribute('href', url);
                      a.setAttribute('download', 'attendance_template.csv');
                      a.click();
                    }}
                    className="text-burgundy-700 font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Template</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">File: <strong className="text-slate-900">{importFileName}</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">5 Valid Records Previewed</span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F3] border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2">Code</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Punch In/Out</th>
                        <th className="p-2 text-right">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {importPreviewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF7F3]">
                          <td className="p-2 font-mono font-bold text-burgundy-700">{row.employee_code}</td>
                          <td className="p-2 font-medium text-slate-800">{row.name}</td>
                          <td className="p-2 text-slate-500">{row.date}</td>
                          <td className="p-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-slate-600">{row.in ? `${row.in} - ${row.out}` : '-'}</td>
                          <td className="p-2 text-right text-emerald-600 font-semibold">{row.validation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button onClick={() => setImportStep('upload')} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    Back
                  </button>
                  <button onClick={handleConfirmImport} className="px-5 py-2 rounded-xl bg-[#8B3552] text-white font-semibold shadow-xs">
                    Confirm & Save 5 Records
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECORD DETAILS MODAL */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">Attendance Audit Inspection</h3>
                <p className="text-xs text-slate-500 font-medium">Record ID: {selectedRecord.attendance_id}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#FAF7F3] rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between"><span className="text-slate-500">Employee:</span> <strong className="text-slate-900">{selectedRecord.employee_name} ({selectedRecord.employee_code})</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Date:</span> <strong className="text-slate-900">{selectedRecord.attendance_date}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span> <strong className="text-slate-900">{selectedRecord.status}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Check In / Out:</span> <strong className="font-mono text-slate-900">{selectedRecord.check_in_time || '-'} to {selectedRecord.check_out_time || '-'}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Worked Hours:</span> <strong className="text-burgundy-700">{selectedRecord.worked_hours !== undefined ? `${selectedRecord.worked_hours} hours` : '-'}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Campus:</span> <strong className="text-slate-900">{selectedRecord.branch_name}</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">Department:</span> <strong className="text-slate-900">{selectedRecord.department}</strong></div>
              <div className="pt-2 border-t border-slate-200 text-slate-600">
                <span className="text-slate-500 block mb-0.5">Remarks:</span>
                <p className="italic">{selectedRecord.remarks || 'No remarks entered'}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
                Last modified by {selectedRecord.last_updated_by} at {selectedRecord.last_updated_time}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
