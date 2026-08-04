import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { Employee, Company } from '../types';
import { EmployeeProfileModal } from '../components/employee/EmployeeProfileModal';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

interface EmployeesProps {
  onSelectEmployee: (emp: Employee) => void;
  selectedEmployee: Employee | null;
}

export const EmployeesPage: React.FC<EmployeesProps> = ({ onSelectEmployee, selectedEmployee }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [profileOpen, setProfileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Employee Form State
  const [fullName, setFullName] = useState('');
  const [empCode, setEmpCode] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Senior Specialist');
  const [companyId, setCompanyId] = useState('cmp-101');

  const loadData = async () => {
    const empList = await dataService.getEmployees();
    const cmpList = await dataService.getCompanies();
    setEmployees(empList);
    setCompanies(cmpList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardClick = (emp: Employee) => {
    onSelectEmployee(emp);
    setProfileOpen(true);
  };

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchesQuery =
      e.full_name.toLowerCase().includes(q) ||
      e.employee_code.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q);
    const matchesDept = deptFilter === 'all' || e.department === deptFilter;
    return matchesQuery && matchesDept;
  });

  const handleAddEmployee = async () => {
    const selectedCmp = companies.find((c) => c.id === companyId);
    await dataService.addEmployee({
      employee_code: empCode,
      full_name: fullName || 'New Team Member',
      mobile: mobile || '+1 (555) 000-1122',
      email: email || 'employee@enterprise.com',
      department,
      designation,
      profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joining_date: new Date().toISOString().split('T')[0],
      shift_start: '09:00:00',
      shift_end: '18:00:00',
      is_active: true,
      company_id: companyId,
      company_name: selectedCmp?.company_name || 'Apex Technology Systems',
    });
    setAddModalOpen(false);
    loadData();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
            Employee Directory ({filtered.length})
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Manage staff credentials, assigned company hubs, work shifts, and personal profiles.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => exportToExcel(employees, 'Employees_Master_List.xlsx')}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            + Add New Employee
          </Button>
        </Stack>
      </Box>

      {/* Filter Bar */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Name, Code, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#059669' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: '#FFFFFF' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            fullWidth
            size="small"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            sx={{ borderRadius: '12px', bgcolor: '#FFFFFF' }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
            <MenuItem value="Research & Development">Research & Development</MenuItem>
            <MenuItem value="Logistics">Logistics</MenuItem>
            <MenuItem value="Human Resources">Human Resources</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Employee Cards Grid */}
      <Grid container spacing={2.5}>
        {filtered.map((emp) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
            <Card
              elevation={0}
              onClick={() => handleCardClick(emp)}
              sx={{
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: '#059669',
                  boxShadow: '0 12px 28px rgba(5,150,105,0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Avatar
                  src={emp.profile_photo_url}
                  sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, border: '3px solid #059669' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem', lineHeight: 1.2 }}>
                  {emp.full_name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block', mb: 1 }}>
                  {emp.employee_code}
                </Typography>

                <Chip label={emp.designation} size="small" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 600, mb: 1.5 }} />

                <Box sx={{ textAlign: 'left', pt: 1.5, borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="inherit" sx={{ color: '#059669' }} /> {emp.company_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="inherit" sx={{ color: '#2563EB' }} /> {emp.mobile}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="inherit" sx={{ color: '#D97706' }} /> {emp.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Employee Profile Modal */}
      <EmployeeProfileModal employee={selectedEmployee} open={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Add New Employee Dialog */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>Register New Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth size="small" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Employee Code" value={empCode} onChange={(e) => setEmpCode(e.target.value)} fullWidth size="small" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} fullWidth size="small" />
            </Grid>
            <Grid item xs={12}>
              <Select value={companyId} onChange={(e) => setCompanyId(e.target.value)} fullWidth size="small">
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.company_name} ({c.company_code})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEmployee} sx={{ bgcolor: '#059669' }}>
            Create Employee Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
