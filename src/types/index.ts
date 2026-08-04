/**
 * Enterprise Employee Attendance Admin - Database & Application Types
 * Exactly matches Supabase schema specification.
 */

export interface Company {
  id: string;
  company_code: string;
  company_name: string;
  address: string;
  latitude: number;
  longitude: number;
  allowed_radius: number; // in meters
  is_active: boolean;
  created_at: string;
  // Computed / UI helper fields
  total_employees?: number;
  present_today?: number;
  attendance_percentage?: number;
}

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  mobile: string;
  email: string;
  department: string;
  designation: string;
  profile_photo_url: string;
  joining_date: string;
  shift_start: string; // e.g., "09:00:00"
  shift_end: string;   // e.g., "18:00:00"
  is_active: boolean;
  created_at: string;
  // Mapped company fields
  company_id?: string;
  company_name?: string;
}

export interface EmployeeCompanyMapping {
  employee_id: string;
  company_id: string;
  is_default: boolean;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';

export interface Attendance {
  id: string;
  employee_id: string;
  company_id: string;
  attendance_date: string; // YYYY-MM-DD
  punch_in: string | null;  // HH:mm:ss
  punch_out: string | null; // HH:mm:ss
  attendance_status: AttendanceStatus;
  working_minutes: number;
  overtime_minutes: number;
  late_minutes: number;
  early_leave_minutes: number;
  location_verified: boolean;
  punch_in_latitude: number | null;
  punch_in_longitude: number | null;
  punch_out_latitude: number | null;
  punch_out_longitude: number | null;
  punch_in_address: string | null;
  punch_out_address: string | null;
  punch_in_distance: number | null; // distance in meters from company office
  punch_out_distance: number | null;
  selfie_url: string | null;
  device_model: string | null;
  battery_percentage: number | null;
  internet_type: string | null; // e.g., "4G", "5G", "Wi-Fi"
  ip_address: string | null;
  remarks: string | null;
  created_at?: string;

  // Joined fields for Data Grid UI
  employee_code?: string;
  employee_name?: string;
  employee_photo?: string;
  company_name?: string;
  department?: string;
  designation?: string;
}

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  company_id?: string;
  leave_type: LeaveType;
  from_date: string; // YYYY-MM-DD
  to_date: string;   // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  created_at: string;

  // Joined fields
  employee_code?: string;
  employee_name?: string;
  company_name?: string;
  department?: string;
}

export interface Holiday {
  id: string;
  company_id: string | null; // null means all companies
  holiday_date: string;     // YYYY-MM-DD
  holiday_name: string;
  created_at: string;
  
  // Joined fields
  company_name?: string;
}

export interface DashboardKPIs {
  todaysPresent: number;
  todaysAbsent: number;
  lateEmployees: number;
  checkedIn: number;
  checkedOut: number;
  workingEmployees: number;
  onLeave: number;
  totalCompanies: number;
  totalEmployees: number;
  attendancePercentage: number;
  avgWorkingHours: number;
  totalOvertimeHours: number;
}

export interface GlobalFilterState {
  companyId: string;
  department: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'late' | 'leave' | 'holiday' | 'system' | 'attendance';
  timestamp: string;
  read: boolean;
}
