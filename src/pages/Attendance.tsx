import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
} from '@mui/icons-material';
import { useFilter } from '../contexts/FilterContext';
import { dataService } from '../services/dataService';
import { Attendance, Company } from '../types';
import { AttendanceDetailDialog } from '../components/attendance/AttendanceDetailDialog';
import { exportToExcel, exportToCSV, exportToPDF, printDataReport } from '../utils/exportUtils';

export const AttendancePage: React.FC = () => {
  const { filters, setCompanyId, setDepartment, setStatus, setSearchQuery } = useFilter();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [manualPunchOpen, setManualPunchOpen] = useState(false);

  // New Punch Form State
  const [empId, setEmpId] = useState('emp-001');
  const [punchType, setPunchType] = useState<'Present' | 'Late' | 'Absent'>('Present');
  const [punchTime, setPunchTime] = useState('09:00:00');
  const [remarks, setRemarks] = useState('Manual admin entry');

  const loadData = async () => {
    const list = await dataService.getAttendance(filters);
    const cmps = await dataService.getCompanies();
    setAttendance(list);
    setCompanies(cmps);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleRowClick = (params: any) => {
    setSelectedRecord(params.row as Attendance);
    setDetailOpen(true);
  };

  const handleExportExcel = () => {
    exportToExcel(attendance, 'Attendance_Master_Report.xlsx');
  };

  const handleExportCSV = () => {
    exportToCSV(attendance, 'Attendance_Master_Report.csv');
  };

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Daily Master Attendance Log',
      companyName: 'Apex Technology Systems',
      dateRange: filters.startDate && filters.endDate ? `${filters.startDate} to ${filters.endDate}` : 'Current Month',
      summaryItems: [
        { label: 'Total Punches', value: attendance.length },
        { label: 'Present Today', value: attendance.filter(a => a.attendance_status === 'Present').length },
        { label: 'Late Punches', value: attendance.filter(a => a.attendance_status === 'Late').length },
        { label: 'Verified GPS', value: attendance.filter(a => a.location_verified).length },
      ],
      columns: [
        { header: 'Emp Code', dataKey: 'employee_code' },
        { header: 'Employee Name', dataKey: 'employee_name' },
        { header: 'Company', dataKey: 'company_name' },
        { header: 'Date', dataKey: 'attendance_date' },
        { header: 'Punch In', dataKey: 'punch_in' },
        { header: 'Punch Out', dataKey: 'punch_out' },
        { header: 'Status', dataKey: 'attendance_status' },
      ],
      data: attendance,
      fileName: 'Attendance_PDF_Report.pdf',
    });
  };

  const handlePrint = () => {
    const cols = ['Emp Code', 'Employee Name', 'Company', 'Date', 'Punch In', 'Punch Out', 'Status', 'Work Mins'];
    const rows = attendance.map(a => [
      a.employee_code || '-',
      a.employee_name || '-',
      a.company_name || '-',
      a.attendance_date,
      a.punch_in || '-',
      a.punch_out || '-',
      a.attendance_status,
      a.working_minutes,
    ]);
    printDataReport('Master Attendance Records Log', cols, rows);
  };

  const handleAddManualPunch = async () => {
    await dataService.addPunchRecord({
      employee_id: empId,
      company_id: 'cmp-101',
      attendance_date: new Date().toISOString().split('T')[0],
      punch_in: punchTime,
      punch_out: null,
      attendance_status: punchType,
      working_minutes: 480,
      overtime_minutes: 0,
      late_minutes: punchType === 'Late' ? 25 : 0,
      early_leave_minutes: 0,
      location_verified: true,
      punch_in_latitude: 37.7749,
      punch_in_longitude: -122.4194,
      punch_out_latitude: null,
      punch_out_longitude: null,
      punch_in_address: 'Main Office Gate Admin Portal',
      punch_out_address: null,
      punch_in_distance: 10,
      punch_out_distance: null,
      selfie_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      device_model: 'Admin Desktop Portal',
      battery_percentage: 100,
      internet_type: 'LAN',
      ip_address: '192.168.1.1',
      remarks,
    });
    setManualPunchOpen(false);
    loadData();
  };

  const columns: GridColDef[] = [
    {
      field: 'employee_name',
      headerName: 'Employee',
      width: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
          <Avatar src={params.row.employee_photo} sx={{ width: 34, height: 34, border: '1px solid #059669' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {params.value}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              {params.row.employee_code}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'company_name', headerName: 'Company', width: 200 },
    { field: 'department', headerName: 'Department', width: 140 },
    { field: 'designation', headerName: 'Designation', width: 160 },
    { field: 'attendance_date', headerName: 'Date', width: 120 },
    { field: 'punch_in', headerName: 'Punch In', width: 110 },
    { field: 'punch_out', headerName: 'Punch Out', width: 110 },
    {
      field: 'working_minutes',
      headerName: 'Working Hours',
      width: 130,
      valueGetter: (params: any, row: Attendance) => `${Math.floor(row.working_minutes / 60)}h ${row.working_minutes % 60}m`,
    },
    { field: 'late_minutes', headerName: 'Late Mins', width: 100 },
    { field: 'overtime_minutes', headerName: 'Overtime', width: 100 },
    {
      field: 'attendance_status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Present'
              ? 'success'
              : params.value === 'Late'
              ? 'warning'
              : params.value === 'On Leave'
              ? 'info'
              : 'error'
          }
          sx={{ fontWeight: 700, borderRadius: '8px' }}
        />
      ),
    },
    {
      field: 'location_verified',
      headerName: 'GPS Verified',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          icon={params.value ? <CheckCircleIcon style={{ color: '#059669' }} /> : <CancelIcon style={{ color: '#DC2626' }} />}
          label={params.value ? 'Verified' : 'Alert'}
          size="small"
          sx={{
            bgcolor: params.value ? '#ECFDF5' : '#FEF2F2',
            color: params.value ? '#047857' : '#DC2626',
            fontWeight: 700,
          }}
        />
      ),
    },
    { field: 'punch_in_distance', headerName: 'Distance', width: 100, valueGetter: (p: any, r: Attendance) => (r.punch_in_distance ? `${r.punch_in_distance}m` : 'N/A') },
    { field: 'remarks', headerName: 'Remarks', width: 200 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Title & Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
            Attendance Master Log
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Inspect punch activities, geofencing verification, overtime, and biometric selfie scans.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button variant="outlined" startIcon={<ExcelIcon />} onClick={handleExportExcel} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Export Excel
          </Button>
          <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Export PDF
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Print
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setManualPunchOpen(true)} sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
            + Record Punch
          </Button>
        </Stack>
      </Box>

      {/* Filter Controls Toolbar */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Employee, Code..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#059669' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px' },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Select
              fullWidth
              size="small"
              value={filters.companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="all">All Companies</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.company_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Select
              fullWidth
              size="small"
              value={filters.status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Main DataGrid Table */}
      <Paper elevation={0} sx={{ height: 620, width: '100%', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <DataGrid
          rows={attendance}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          onRowClick={handleRowClick}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', color: '#0F172A', fontWeight: 800 },
            '& .MuiDataGrid-row': { cursor: 'pointer', '&:hover': { bgcolor: '#ECFDF5' } },
          }}
        />
      </Paper>

      {/* Detail Dialog */}
      <AttendanceDetailDialog attendance={selectedRecord} open={detailOpen} onClose={() => setDetailOpen(false)} />

      {/* Manual Punch Entry Dialog */}
      <Dialog open={manualPunchOpen} onClose={() => setManualPunchOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Record Manual Attendance Punch</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Select value={empId} onChange={(e) => setEmpId(e.target.value)} fullWidth size="small">
            <MenuItem value="emp-001">Sarah Jenkins (EMP-1001)</MenuItem>
            <MenuItem value="emp-002">Michael Chang (EMP-1002)</MenuItem>
            <MenuItem value="emp-003">Elena Rostova (EMP-1003)</MenuItem>
            <MenuItem value="emp-004">David Miller (EMP-1004)</MenuItem>
          </Select>
          <Select value={punchType} onChange={(e) => setPunchType(e.target.value as any)} fullWidth size="small">
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </Select>
          <TextField label="Punch Time" type="time" value={punchTime} onChange={(e) => setPunchTime(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
          <TextField label="Admin Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} fullWidth size="small" multiline rows={2} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setManualPunchOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddManualPunch} sx={{ bgcolor: '#059669' }}>Save Punch Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
