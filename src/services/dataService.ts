import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Company, Employee, Attendance, LeaveRequest, Holiday, DashboardKPIs, GlobalFilterState } from '../types';
import { INITIAL_COMPANIES, INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVE_REQUESTS, INITIAL_HOLIDAYS } from '../data/mockData';

// Storage Keys for Offline/Fallback Mode
const STORAGE_COMPANIES = 'attendance_app_companies';
const STORAGE_EMPLOYEES = 'attendance_app_employees';
const STORAGE_ATTENDANCE = 'attendance_app_attendance';
const STORAGE_LEAVES = 'attendance_app_leaves';
const STORAGE_HOLIDAYS = 'attendance_app_holidays';

// Helper to initialize local storage
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting ${key} in localStorage`, err);
  }
}

export function initLocalDataIfEmpty() {
  if (!localStorage.getItem(STORAGE_COMPANIES)) setLocalItem(STORAGE_COMPANIES, INITIAL_COMPANIES);
  if (!localStorage.getItem(STORAGE_EMPLOYEES)) setLocalItem(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);
  if (!localStorage.getItem(STORAGE_ATTENDANCE)) setLocalItem(STORAGE_ATTENDANCE, INITIAL_ATTENDANCE);
  if (!localStorage.getItem(STORAGE_LEAVES)) setLocalItem(STORAGE_LEAVES, INITIAL_LEAVE_REQUESTS);
  if (!localStorage.getItem(STORAGE_HOLIDAYS)) setLocalItem(STORAGE_HOLIDAYS, INITIAL_HOLIDAYS);
}

// Reset data helper
export function resetDemoData() {
  setLocalItem(STORAGE_COMPANIES, INITIAL_COMPANIES);
  setLocalItem(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);
  setLocalItem(STORAGE_ATTENDANCE, INITIAL_ATTENDANCE);
  setLocalItem(STORAGE_LEAVES, INITIAL_LEAVE_REQUESTS);
  setLocalItem(STORAGE_HOLIDAYS, INITIAL_HOLIDAYS);
}

// Service Methods
export const dataService = {
  // --- COMPANIES ---
  async getCompanies(): Promise<Company[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('companies').select('*');
      if (!error && data) return data as Company[];
    }
    initLocalDataIfEmpty();
    const companies = getLocalItem<Company[]>(STORAGE_COMPANIES, INITIAL_COMPANIES);
    const employees = getLocalItem<Employee[]>(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);
    const attendance = getLocalItem<Attendance[]>(STORAGE_ATTENDANCE, INITIAL_ATTENDANCE);
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute live stats per company
    return companies.map(c => {
      const empList = employees.filter(e => e.company_id === c.id);
      const total = empList.length;
      const todayAtt = attendance.filter(a => a.company_id === c.id && a.attendance_date === todayStr);
      const present = todayAtt.filter(a => a.attendance_status === 'Present' || a.attendance_status === 'Late').length;
      const rate = total > 0 ? Math.round((present / total) * 1000) / 10 : 0;
      return {
        ...c,
        total_employees: total || c.total_employees || 0,
        present_today: present || c.present_today || 0,
        attendance_percentage: rate || c.attendance_percentage || 0,
      };
    });
  },

  async addCompany(company: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
    const newCompany: Company = {
      ...company,
      id: 'cmp-' + Date.now(),
      created_at: new Date().toISOString(),
      total_employees: 0,
      present_today: 0,
      attendance_percentage: 0,
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('companies').insert([company]).select().single();
      if (!error && data) return data as Company;
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<Company[]>(STORAGE_COMPANIES, INITIAL_COMPANIES);
    const updated = [newCompany, ...list];
    setLocalItem(STORAGE_COMPANIES, updated);
    return newCompany;
  },

  // --- EMPLOYEES ---
  async getEmployees(companyId?: string): Promise<Employee[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('employees').select('*');
      if (companyId) query = query.eq('company_id', companyId);
      const { data, error } = await query;
      if (!error && data) return data as Employee[];
    }
    initLocalDataIfEmpty();
    let employees = getLocalItem<Employee[]>(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);
    if (companyId && companyId !== 'all') {
      employees = employees.filter(e => e.company_id === companyId);
    }
    return employees;
  },

  async addEmployee(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    const newEmp: Employee = {
      ...employee,
      id: 'emp-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('employees').insert([employee]).select().single();
      if (!error && data) return data as Employee;
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<Employee[]>(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);
    const updated = [newEmp, ...list];
    setLocalItem(STORAGE_EMPLOYEES, updated);
    return newEmp;
  },

  // --- ATTENDANCE ---
  async getAttendance(filters?: GlobalFilterState): Promise<Attendance[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('attendance').select('*');
      if (filters?.companyId && filters.companyId !== 'all') {
        query = query.eq('company_id', filters.companyId);
      }
      if (filters?.startDate) {
        query = query.gte('attendance_date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('attendance_date', filters.endDate);
      }
      const { data, error } = await query;
      if (!error && data) return data as Attendance[];
    }
    initLocalDataIfEmpty();
    let list = getLocalItem<Attendance[]>(STORAGE_ATTENDANCE, INITIAL_ATTENDANCE);
    const employees = getLocalItem<Employee[]>(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);

    // Join employee data
    list = list.map(a => {
      const emp = employees.find(e => e.id === a.employee_id);
      return {
        ...a,
        employee_code: a.employee_code || emp?.employee_code || 'EMP-N/A',
        employee_name: a.employee_name || emp?.full_name || 'Unknown',
        employee_photo: a.employee_photo || emp?.profile_photo_url,
        company_name: a.company_name || emp?.company_name || 'Main Office',
        department: a.department || emp?.department || 'General',
        designation: a.designation || emp?.designation || 'Staff',
      };
    });

    // Apply filters
    if (filters) {
      if (filters.companyId && filters.companyId !== 'all') {
        list = list.filter(a => a.company_id === filters.companyId);
      }
      if (filters.department && filters.department !== 'all') {
        list = list.filter(a => a.department === filters.department);
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(a => a.attendance_status === filters.status);
      }
      if (filters.startDate) {
        list = list.filter(a => a.attendance_date >= filters.startDate);
      }
      if (filters.endDate) {
        list = list.filter(a => a.attendance_date <= filters.endDate);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(a => 
          a.employee_name?.toLowerCase().includes(q) ||
          a.employee_code?.toLowerCase().includes(q) ||
          a.department?.toLowerCase().includes(q) ||
          a.company_name?.toLowerCase().includes(q)
        );
      }
    }

    return list;
  },

  async addPunchRecord(record: Omit<Attendance, 'id'>): Promise<Attendance> {
    const newRecord: Attendance = {
      ...record,
      id: 'att-' + Date.now(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('attendance').insert([record]).select().single();
      if (!error && data) return data as Attendance;
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<Attendance[]>(STORAGE_ATTENDANCE, INITIAL_ATTENDANCE);
    const updated = [newRecord, ...list];
    setLocalItem(STORAGE_ATTENDANCE, updated);
    return newRecord;
  },

  // --- LEAVE REQUESTS ---
  async getLeaveRequests(companyId?: string): Promise<LeaveRequest[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('leave_requests').select('*');
      if (companyId && companyId !== 'all') query = query.eq('company_id', companyId);
      const { data, error } = await query;
      if (!error && data) return data as LeaveRequest[];
    }
    initLocalDataIfEmpty();
    let leaves = getLocalItem<LeaveRequest[]>(STORAGE_LEAVES, INITIAL_LEAVE_REQUESTS);
    const employees = getLocalItem<Employee[]>(STORAGE_EMPLOYEES, INITIAL_EMPLOYEES);

    leaves = leaves.map(l => {
      const emp = employees.find(e => e.id === l.employee_id);
      return {
        ...l,
        employee_code: l.employee_code || emp?.employee_code,
        employee_name: l.employee_name || emp?.full_name,
        company_name: l.company_name || emp?.company_name,
        department: l.department || emp?.department,
      };
    });

    if (companyId && companyId !== 'all') {
      leaves = leaves.filter(l => l.company_id === companyId);
    }
    return leaves;
  },

  async updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected'): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('leave_requests').update({ status }).eq('id', leaveId);
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<LeaveRequest[]>(STORAGE_LEAVES, INITIAL_LEAVE_REQUESTS);
    const updated = list.map(l => l.id === leaveId ? { ...l, status } : l);
    setLocalItem(STORAGE_LEAVES, updated);
  },

  async addLeaveRequest(req: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
    const newReq: LeaveRequest = {
      ...req,
      id: 'lv-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leave_requests').insert([req]).select().single();
      if (!error && data) return data as LeaveRequest;
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<LeaveRequest[]>(STORAGE_LEAVES, INITIAL_LEAVE_REQUESTS);
    const updated = [newReq, ...list];
    setLocalItem(STORAGE_LEAVES, updated);
    return newReq;
  },

  // --- HOLIDAYS ---
  async getHolidays(companyId?: string): Promise<Holiday[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('holidays').select('*');
      const { data, error } = await query;
      if (!error && data) return data as Holiday[];
    }
    initLocalDataIfEmpty();
    let holidays = getLocalItem<Holiday[]>(STORAGE_HOLIDAYS, INITIAL_HOLIDAYS);
    if (companyId && companyId !== 'all') {
      holidays = holidays.filter(h => h.company_id === null || h.company_id === companyId);
    }
    return holidays;
  },

  async addHoliday(holiday: Omit<Holiday, 'id' | 'created_at'>): Promise<Holiday> {
    const newHoliday: Holiday = {
      ...holiday,
      id: 'hol-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('holidays').insert([holiday]).select().single();
      if (!error && data) return data as Holiday;
    }
    initLocalDataIfEmpty();
    const list = getLocalItem<Holiday[]>(STORAGE_HOLIDAYS, INITIAL_HOLIDAYS);
    const updated = [newHoliday, ...list];
    setLocalItem(STORAGE_HOLIDAYS, updated);
    return newHoliday;
  },

  // --- DASHBOARD KPIS COMPUTATION ---
  async getDashboardKPIs(filters?: GlobalFilterState): Promise<DashboardKPIs> {
    const companies = await this.getCompanies();
    const employees = await this.getEmployees(filters?.companyId);
    const attendance = await this.getAttendance(filters);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAtt = attendance.filter(a => a.attendance_date === todayStr);

    const todaysPresent = todaysAtt.filter(a => a.attendance_status === 'Present' || a.attendance_status === 'Late').length;
    const todaysAbsent = todaysAtt.filter(a => a.attendance_status === 'Absent').length;
    const lateEmployees = todaysAtt.filter(a => a.attendance_status === 'Late' || a.late_minutes > 0).length;
    const checkedIn = todaysAtt.filter(a => a.punch_in !== null).length;
    const checkedOut = todaysAtt.filter(a => a.punch_out !== null).length;
    const workingEmployees = todaysAtt.filter(a => a.punch_in !== null && a.punch_out === null).length;
    const onLeave = todaysAtt.filter(a => a.attendance_status === 'On Leave').length;

    const totalEmployees = employees.length || 1;
    const attendancePercentage = Math.round((todaysPresent / totalEmployees) * 1000) / 10;

    let totalWorkingMins = 0;
    let totalOvertimeMins = 0;
    let recordCount = 0;

    attendance.forEach(a => {
      if (a.working_minutes > 0) {
        totalWorkingMins += a.working_minutes;
        totalOvertimeMins += a.overtime_minutes || 0;
        recordCount++;
      }
    });

    const avgWorkingHours = recordCount > 0 ? Math.round((totalWorkingMins / recordCount / 60) * 10) / 10 : 8.0;
    const totalOvertimeHours = Math.round((totalOvertimeMins / 60) * 10) / 10;

    return {
      todaysPresent,
      todaysAbsent,
      lateEmployees,
      checkedIn,
      checkedOut,
      workingEmployees,
      onLeave,
      totalCompanies: companies.length,
      totalEmployees,
      attendancePercentage,
      avgWorkingHours,
      totalOvertimeHours,
    };
  }
};
