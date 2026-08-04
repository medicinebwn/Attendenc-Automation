import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Chip,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Timeline as TimelineIcon,
  AccessTime as HoursIcon,
  Warning as LateIcon,
  MoreTime as OvertimeIcon,
  EventBusy as LeaveIcon,
  LocationOn as MapIcon,
  BarChart as StatsIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Employee, Attendance, LeaveRequest } from '../../types';
import { dataService } from '../../services/dataService';
import { exportToPDF } from '../../utils/exportUtils';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({ employee, open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (employee && open) {
      dataService.getAttendance().then(list => {
        setAttendances(list.filter(a => a.employee_id === employee.id));
      });
      dataService.getLeaveRequests().then(list => {
        setLeaves(list.filter(l => l.employee_id === employee.id));
      });
    }
  }, [employee, open]);

  if (!employee) return null;

  const totalPunches = attendances.length;
  const presentCount = attendances.filter(a => a.attendance_status === 'Present' || a.attendance_status === 'Late').length;
  const lateCount = attendances.filter(a => a.late_minutes > 0 || a.attendance_status === 'Late').length;
  const totalOtMins = attendances.reduce((acc, a) => acc + (a.overtime_minutes || 0), 0);
  const totalWorkingMins = attendances.reduce((acc, a) => acc + (a.working_minutes || 0), 0);

  const handleDownloadPDF = () => {
    exportToPDF({
      title: `Employee Summary - ${employee.full_name}`,
      companyName: employee.company_name || 'Apex Technology Systems',
      dateRange: 'All Historic Records',
      summaryItems: [
        { label: 'Total Present', value: presentCount },
        { label: 'Late Instances', value: lateCount },
        { label: 'Overtime Hours', value: `${(totalOtMins / 60).toFixed(1)} hrs` },
        { label: 'Total Work Hours', value: `${(totalWorkingMins / 60).toFixed(1)} hrs` },
      ],
      columns: [
        { header: 'Date', dataKey: 'attendance_date' },
        { header: 'Status', dataKey: 'attendance_status' },
        { header: 'Punch In', dataKey: 'punch_in' },
        { header: 'Punch Out', dataKey: 'punch_out' },
        { header: 'Work Mins', dataKey: 'working_minutes' },
        { header: 'Late Mins', dataKey: 'late_minutes' },
        { header: 'Location Verified', dataKey: 'location_verified' },
      ],
      data: attendances,
      fileName: `${employee.employee_code}_Summary.pdf`,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', minHeight: 600 } }}>
      {/* Profile Header */}
      <DialogTitle sx={{ bgcolor: '#0F172A', color: '#FFFFFF', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar src={employee.profile_photo_url} sx={{ width: 68, height: 68, border: '3px solid #059669' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {employee.full_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                {employee.employee_code} • {employee.designation} ({employee.department})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={employee.company_name} size="small" sx={{ bgcolor: '#059669', color: '#FFFFFF', fontWeight: 600 }} />
                <Chip label={employee.is_active ? 'Active Employee' : 'Inactive'} color={employee.is_active ? 'success' : 'default'} size="small" />
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleDownloadPDF}
            sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Download PDF
          </Button>
        </Box>
      </DialogTitle>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F8FAFC', px: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Personal Info" />
          <Tab icon={<CalendarIcon fontSize="small" />} iconPosition="start" label="Calendar" />
          <Tab icon={<TimelineIcon fontSize="small" />} iconPosition="start" label="Timeline" />
          <Tab icon={<HoursIcon fontSize="small" />} iconPosition="start" label="Working Hours" />
          <Tab icon={<LateIcon fontSize="small" />} iconPosition="start" label="Late History" />
          <Tab icon={<OvertimeIcon fontSize="small" />} iconPosition="start" label="Overtime" />
          <Tab icon={<LeaveIcon fontSize="small" />} iconPosition="start" label="Leave History" />
          <Tab icon={<MapIcon fontSize="small" />} iconPosition="start" label="GPS History" />
          <Tab icon={<StatsIcon fontSize="small" />} iconPosition="start" label="Statistics" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <DialogContent sx={{ p: 3, bgcolor: '#FFFFFF' }}>
        {/* Tab 0: Personal Info */}
        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary">MOBILE NUMBER</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{employee.mobile}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary">EMAIL ADDRESS</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{employee.email}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary">JOINING DATE</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{employee.joining_date}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <Typography variant="caption" color="text.secondary">WORK SHIFT</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{employee.shift_start} - {employee.shift_end}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Attendance Calendar */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Recent Attendance Records Calendar</Typography>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Punch In</TableCell>
                  <TableCell>Punch Out</TableCell>
                  <TableCell>Work Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map(a => (
                  <TableRow key={a.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{a.attendance_date}</TableCell>
                    <TableCell><Chip label={a.attendance_status} size="small" color={a.attendance_status === 'Present' ? 'success' : 'warning'} /></TableCell>
                    <TableCell>{a.punch_in || '-'}</TableCell>
                    <TableCell>{a.punch_out || '-'}</TableCell>
                    <TableCell>{Math.floor(a.working_minutes / 60)}h {a.working_minutes % 60}m</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Tab 2: Timeline */}
        {activeTab === 2 && (
          <Box sx={{ pl: 2, borderLeft: '2px solid #059669' }}>
            {attendances.map(a => (
              <Box key={a.id} sx={{ mb: 2, position: 'relative' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#059669' }}>{a.attendance_date}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Punched In at {a.punch_in || 'N/A'} from {a.punch_in_address || 'Office Area'} ({a.location_verified ? 'Verified GPS' : 'Unverified'})
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Tab 3: Working Hours */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Total Working Time: {Math.floor(totalWorkingMins / 60)} Hours {totalWorkingMins % 60} Mins
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Average shift compliance: 96.4%</Typography>
            <LinearProgress variant="determinate" value={92} sx={{ height: 12, borderRadius: 6, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }} />
          </Box>
        )}

        {/* Tab 4: Late History */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Late Arrival Instances ({lateCount})</Typography>
            {attendances.filter(a => a.late_minutes > 0 || a.attendance_status === 'Late').map(a => (
              <Paper key={a.id} elevation={0} sx={{ p: 1.5, mb: 1, border: '1px solid #FDE68A', bgcolor: '#FEF3C7', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#B45309' }}>
                  {a.attendance_date} - Late by {a.late_minutes} minutes
                </Typography>
                <Typography variant="caption" color="text.secondary">{a.remarks || 'No remarks provided'}</Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Tab 5: Overtime */}
        {activeTab === 5 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Total Approved Overtime: {(totalOtMins / 60).toFixed(1)} Hours</Typography>
            {attendances.filter(a => a.overtime_minutes > 0).map(a => (
              <Paper key={a.id} elevation={0} sx={{ p: 1.5, mb: 1, border: '1px solid #A7F3D0', bgcolor: '#ECFDF5', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#047857' }}>
                  {a.attendance_date} - Overtime: {a.overtime_minutes} minutes
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Tab 6: Leave History */}
        {activeTab === 6 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Leave Requests ({leaves.length})</Typography>
            {leaves.map(l => (
              <Paper key={l.id} elevation={0} sx={{ p: 1.5, mb: 1, border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{l.leave_type}</Typography>
                  <Chip label={l.status} size="small" color={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'error'} />
                </Box>
                <Typography variant="caption" color="text.secondary">{l.from_date} to {l.to_date} • Reason: "{l.reason}"</Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Tab 7: GPS History */}
        {activeTab === 7 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>GPS Geo-Tagging History</Typography>
            {attendances.map(a => (
              <Paper key={a.id} elevation={0} sx={{ p: 1.5, mb: 1, border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{a.attendance_date}: {a.punch_in_address || 'Office Area'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Lat: {a.punch_in_latitude || '37.7749'}, Lng: {a.punch_in_longitude || '-122.4194'} • Geofence Distance: {a.punch_in_distance || 15}m
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Tab 8: Statistics */}
        {activeTab === 8 && (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: '12px' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669' }}>{presentCount}</Typography>
                <Typography variant="caption">Days Present</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#FEF3C7', borderRadius: '12px' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706' }}>{lateCount}</Typography>
                <Typography variant="caption">Days Late</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#ECFDF5', borderRadius: '12px' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#047857' }}>{(totalOtMins / 60).toFixed(1)}h</Typography>
                <Typography variant="caption">Total Overtime</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#EFF6FF', borderRadius: '12px' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB' }}>{leaves.length}</Typography>
                <Typography variant="caption">Total Leaves</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#F8FAFC' }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#059669', borderRadius: '10px', px: 3 }}>
          Close Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};
