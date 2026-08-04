import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { dataService } from '../../services/dataService';
import { Employee, Company, Attendance } from '../../types';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectEmployee?: (emp: Employee) => void;
  onSelectCompany?: (cmp: Company) => void;
  onSelectAttendance?: (att: Attendance) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  onSelectEmployee,
  onSelectCompany,
  onSelectAttendance,
}) => {
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (open) {
      dataService.getEmployees().then(setEmployees);
      dataService.getCompanies().then(setCompanies);
      dataService.getAttendance().then(setAttendance);
    } else {
      setQuery('');
    }
  }, [open]);

  const q = query.toLowerCase().trim();

  const filteredEmps = q
    ? employees.filter(
        e =>
          e.full_name.toLowerCase().includes(q) ||
          e.employee_code.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.mobile.includes(q)
      )
    : [];

  const filteredCmps = q
    ? companies.filter(
        c =>
          c.company_name.toLowerCase().includes(q) ||
          c.company_code.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      )
    : [];

  const filteredAtt = q
    ? attendance.filter(
        a =>
          a.employee_name?.toLowerCase().includes(q) ||
          a.employee_code?.toLowerCase().includes(q) ||
          a.attendance_status.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search Employees, Companies, Code, Mobile, Email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#059669' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: '#F8FAFC' },
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ maxHeight: 420, overflowY: 'auto' }}>
        {!q && (
          <Box sx={{ py: 4, textAlign: 'center', color: '#64748B' }}>
            <SearchIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
            <Typography variant="body2">Type to search across entire HRMS database</Typography>
            <Typography variant="caption" color="text.secondary">
              Try "Sarah", "EMP-1001", "Engineering", "Apex", or "9012"
            </Typography>
          </Box>
        )}

        {q && filteredEmps.length === 0 && filteredCmps.length === 0 && filteredAtt.length === 0 && (
          <Box sx={{ py: 4, textAlign: 'center', color: '#64748B' }}>
            <Typography variant="body2">No matching records found for "{query}"</Typography>
          </Box>
        )}

        {filteredEmps.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669', px: 2, uppercase: true }}>
              EMPLOYEES ({filteredEmps.length})
            </Typography>
            <List size="small">
              {filteredEmps.map(emp => (
                <ListItemButton
                  key={emp.id}
                  onClick={() => {
                    onSelectEmployee?.(emp);
                    onClose();
                  }}
                  sx={{ borderRadius: '8px', mb: 0.5 }}
                >
                  <ListItemIcon>
                    <PeopleIcon sx={{ color: '#059669' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={emp.full_name}
                    secondary={`${emp.employee_code} • ${emp.department} • ${emp.designation}`}
                  />
                  <Chip label={emp.company_name} size="small" variant="outlined" sx={{ borderRadius: '6px' }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {filteredCmps.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A', px: 2 }}>
              COMPANIES ({filteredCmps.length})
            </Typography>
            <List size="small">
              {filteredCmps.map(cmp => (
                <ListItemButton
                  key={cmp.id}
                  onClick={() => {
                    onSelectCompany?.(cmp);
                    onClose();
                  }}
                  sx={{ borderRadius: '8px', mb: 0.5 }}
                >
                  <ListItemIcon>
                    <BusinessIcon sx={{ color: '#0F172A' }} />
                  </ListItemIcon>
                  <ListItemText primary={cmp.company_name} secondary={`${cmp.company_code} • ${cmp.address}`} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {filteredAtt.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', px: 2 }}>
              ATTENDANCE PUNCHES ({filteredAtt.length})
            </Typography>
            <List size="small">
              {filteredAtt.map(att => (
                <ListItemButton
                  key={att.id}
                  onClick={() => {
                    onSelectAttendance?.(att);
                    onClose();
                  }}
                  sx={{ borderRadius: '8px', mb: 0.5 }}
                >
                  <ListItemIcon>
                    <AccessTimeIcon sx={{ color: '#D97706' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${att.employee_name} (${att.attendance_date})`}
                    secondary={`In: ${att.punch_in || 'N/A'} | Status: ${att.attendance_status}`}
                  />
                  <Chip
                    label={att.attendance_status}
                    size="small"
                    color={att.attendance_status === 'Present' ? 'success' : att.attendance_status === 'Late' ? 'warning' : 'error'}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
