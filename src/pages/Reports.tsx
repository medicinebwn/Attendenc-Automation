import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { Attendance, Company, Employee } from '../types';
import { exportToExcel, exportToCSV, exportToPDF, printDataReport } from '../utils/exportUtils';

const REPORT_TYPES = [
  'Daily Attendance Report',
  'Monthly Attendance Report',
  'Employee Attendance Report',
  'Company Attendance Report',
  'Department Attendance Report',
  'Late Report',
  'Overtime Report',
  'Leave Report',
  'Working Hours Report',
  'Location Verification Report',
  'GPS Distance Report',
  'Punch In Report',
  'Punch Out Report',
  'Holiday Report',
  'Company Summary Report',
  'Employee Summary Report',
];

export const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState(REPORT_TYPES[0]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filter States
  const [companyId, setCompanyId] = useState('all');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadData = async () => {
    const list = await dataService.getAttendance({
      companyId,
      department,
      status,
      startDate,
      endDate,
      searchQuery: '',
    });
    const cmps = await dataService.getCompanies();
    const emps = await dataService.getEmployees();

    setAttendance(list);
    setCompanies(cmps);
    setEmployees(emps);
  };

  useEffect(() => {
    loadData();
  }, [selectedReportType, companyId, department, status, startDate, endDate]);

  const getFilteredReportData = () => {
    let list = [...attendance];
    if (selectedReportType.includes('Late')) {
      list = list.filter(a => a.late_minutes > 0 || a.attendance_status === 'Late');
    } else if (selectedReportType.includes('Overtime')) {
      list = list.filter(a => a.overtime_minutes > 0);
    } else if (selectedReportType.includes('Location') || selectedReportType.includes('GPS')) {
      list = list.filter(a => a.location_verified);
    }
    return list;
  };

  const reportData = getFilteredReportData();

  const handleExportPDF = () => {
    exportToPDF({
      title: selectedReportType,
      companyName: 'Apex Technology Systems',
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'All Selected Periods',
      summaryItems: [
        { label: 'Total Records', value: reportData.length },
        { label: 'Present Today', value: reportData.filter(a => a.attendance_status === 'Present').length },
        { label: 'Late Instances', value: reportData.filter(a => a.late_minutes > 0).length },
        { label: 'Geofence Verified', value: reportData.filter(a => a.location_verified).length },
      ],
      columns: [
        { header: 'Emp Code', dataKey: 'employee_code' },
        { header: 'Employee Name', dataKey: 'employee_name' },
        { header: 'Company', dataKey: 'company_name' },
        { header: 'Department', dataKey: 'department' },
        { header: 'Date', dataKey: 'attendance_date' },
        { header: 'Punch In', dataKey: 'punch_in' },
        { header: 'Punch Out', dataKey: 'punch_out' },
        { header: 'Status', dataKey: 'attendance_status' },
      ],
      data: reportData,
      fileName: `${selectedReportType.replace(/\s+/g, '_')}.pdf`,
    });
  };

  const handleExportExcel = () => {
    exportToExcel(reportData, `${selectedReportType.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleExportCSV = () => {
    exportToCSV(reportData, `${selectedReportType.replace(/\s+/g, '_')}.csv`);
  };

  const handlePrint = () => {
    const cols = ['Emp Code', 'Employee Name', 'Company', 'Department', 'Date', 'Punch In', 'Punch Out', 'Status'];
    const rows = reportData.map(a => [
      a.employee_code || '-',
      a.employee_name || '-',
      a.company_name || '-',
      a.department || '-',
      a.attendance_date,
      a.punch_in || '-',
      a.punch_out || '-',
      a.attendance_status,
    ]);
    printDataReport(selectedReportType, cols, rows);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
            Enterprise HR Reports Generator
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Generate, preview, print, and export 16 customized attendance & compliance report variations.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button variant="outlined" startIcon={<ExcelIcon />} onClick={handleExportExcel} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Export Excel
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCSV} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Export CSV
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Print
          </Button>
          <Button variant="contained" startIcon={<PdfIcon />} onClick={handleExportPDF} sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
            Download PDF Report
          </Button>
        </Stack>
      </Box>

      {/* Select Report Type & Advanced Filters */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Enterprise Report Type</InputLabel>
              <Select
                value={selectedReportType}
                label="Select Enterprise Report Type"
                onChange={(e) => setSelectedReportType(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                {REPORT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Company</InputLabel>
              <Select value={companyId} label="Company" onChange={(e) => setCompanyId(e.target.value)} sx={{ borderRadius: '12px' }}>
                <MenuItem value="all">All Companies</MenuItem>
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={department} label="Department" onChange={(e) => setDepartment(e.target.value)} sx={{ borderRadius: '12px' }}>
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Research & Development">R&D</MenuItem>
                <MenuItem value="Logistics">Logistics</MenuItem>
                <MenuItem value="Human Resources">HR</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField label="Start Date" type="date" size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField label="End Date" type="date" size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Generated Report Table Preview */}
      <Paper elevation={0} sx={{ borderRadius: '18px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
            Report Preview: {selectedReportType} ({reportData.length} records)
          </Typography>
          <Chip label="Enterprise Ready" color="success" size="small" />
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Emp Code</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Employee Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Punch In</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Punch Out</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>GPS Verified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 700, color: '#059669' }}>{row.employee_code}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.employee_name}</TableCell>
                <TableCell>{row.company_name}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.attendance_date}</TableCell>
                <TableCell>{row.punch_in || '-'}</TableCell>
                <TableCell>{row.punch_out || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={row.attendance_status}
                    size="small"
                    color={row.attendance_status === 'Present' ? 'success' : row.attendance_status === 'Late' ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={row.location_verified ? 'Verified' : 'Unverified'} size="small" variant="outlined" color={row.location_verified ? 'success' : 'default'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
