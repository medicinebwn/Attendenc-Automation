import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  PictureAsPdf as PdfIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { Company, Employee, Attendance } from '../../types';
import { dataService } from '../../services/dataService';
import { exportToPDF } from '../../utils/exportUtils';

interface CompanyDetailModalProps {
  company: Company | null;
  open: boolean;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, open, onClose }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (company && open) {
      dataService.getEmployees(company.id).then(setEmployees);
      dataService.getAttendance({ companyId: company.id, department: 'all', startDate: '', endDate: '', searchQuery: '', status: 'all' }).then(setAttendance);
    }
  }, [company, open]);

  if (!company) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAtt = attendance.filter(a => a.attendance_date === todayStr);
  const presentToday = todaysAtt.filter(a => a.attendance_status === 'Present' || a.attendance_status === 'Late').length;
  const absentToday = todaysAtt.filter(a => a.attendance_status === 'Absent').length;
  const leaveToday = todaysAtt.filter(a => a.attendance_status === 'On Leave').length;

  const mapUrl = `https://maps.google.com/maps?q=${company.latitude},${company.longitude}&z=15&output=embed`;

  const handleDownloadReport = () => {
    exportToPDF({
      title: `Company Dashboard Summary - ${company.company_name}`,
      companyName: company.company_name,
      dateRange: `As of ${new Date().toLocaleDateString()}`,
      summaryItems: [
        { label: 'Total Staff', value: employees.length },
        { label: 'Present Today', value: presentToday },
        { label: 'Attendance %', value: `${company.attendance_percentage || 90}%` },
        { label: 'Geofence Radius', value: `${company.allowed_radius}m` },
      ],
      columns: [
        { header: 'Emp Code', dataKey: 'employee_code' },
        { header: 'Full Name', dataKey: 'full_name' },
        { header: 'Department', dataKey: 'department' },
        { header: 'Designation', dataKey: 'designation' },
        { header: 'Mobile', dataKey: 'mobile' },
        { header: 'Email', dataKey: 'email' },
      ],
      data: employees,
      fileName: `${company.company_code}_Executive_Report.pdf`,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <DialogTitle sx={{ bgcolor: '#0F172A', color: '#FFFFFF', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 54, height: 54, borderRadius: '14px', bgcolor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BusinessIcon sx={{ color: '#FFFFFF', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {company.company_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Code: {company.company_code} • Allowed Radius: {company.allowed_radius}m
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleDownloadReport}
            sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Download Report
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#F8FAFC' }}>
        {/* KPI Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="caption" color="text.secondary">TOTAL EMPLOYEES</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{employees.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#ECFDF5' }}>
              <Typography variant="caption" sx={{ color: '#047857' }}>PRESENT TODAY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>{presentToday}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#FEF2F2' }}>
              <Typography variant="caption" sx={{ color: '#B91C1C' }}>ABSENT TODAY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#DC2626' }}>{absentToday}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#EFF6FF' }}>
              <Typography variant="caption" sx={{ color: '#1D4ED8' }}>ATTENDANCE RATE</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB' }}>{company.attendance_percentage || 90}%</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Location & Geofence Map */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#DC2626' }} /> Office Address & Geofence Boundary
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', mb: 1.5 }}>{company.address}</Typography>
              <Box sx={{ width: '100%', height: 180, borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                <iframe title="Company Map" width="100%" height="100%" frameBorder="0" src={mapUrl} />
              </Box>
            </Paper>
          </Grid>

          {/* Assigned Staff List */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: '#059669' }} /> Assigned Employees ({employees.length})
              </Typography>
              <List size="small" sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {employees.map(emp => (
                  <ListItem key={emp.id} sx={{ px: 1, py: 0.5 }}>
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar src={emp.profile_photo_url} sx={{ width: 34, height: 34 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>{emp.full_name}</Typography>}
                      secondary={`${emp.employee_code} • ${emp.department}`}
                    />
                    <Chip label="Active" size="small" color="success" sx={{ fontSize: '0.7rem' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#059669', borderRadius: '10px', px: 3 }}>
          Close Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};
