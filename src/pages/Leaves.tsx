import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Add as AddIcon,
  EventBusy as LeaveIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { LeaveRequest, Employee } from '../types';

export const LeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Pending, 2: Approved, 3: Rejected
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [empId, setEmpId] = useState('emp-005');
  const [leaveType, setLeaveType] = useState<any>('Casual Leave');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Personal family event');

  const loadData = async () => {
    const list = await dataService.getLeaveRequests();
    const emps = await dataService.getEmployees();
    setLeaves(list);
    setEmployees(emps);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    await dataService.updateLeaveStatus(id, status);
    loadData();
  };

  const handleAddLeave = async () => {
    const emp = employees.find(e => e.id === empId);
    await dataService.addLeaveRequest({
      employee_id: empId,
      company_id: emp?.company_id || 'cmp-101',
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
      reason,
      status: 'Pending',
    });
    setAddModalOpen(false);
    loadData();
  };

  const filteredLeaves = leaves.filter(l => {
    if (activeTab === 1) return l.status === 'Pending';
    if (activeTab === 2) return l.status === 'Approved';
    if (activeTab === 3) return l.status === 'Rejected';
    return true;
  });

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
            Leave Management Portal
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Review pending leave applications, approve/reject requests, and inspect leave balance histories.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
        >
          + Submit Leave Request
        </Button>
      </Box>

      {/* KPI Cards Banner */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #FEF3C7', bgcolor: '#FEF3C7' }}>
            <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700 }}>PENDING APPROVALS</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706' }}>{pendingCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #A7F3D0', bgcolor: '#ECFDF5' }}>
            <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>APPROVED LEAVES</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>{approvedCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #FCA5A5', bgcolor: '#FEF2F2' }}>
            <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 700 }}>REJECTED LEAVES</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#DC2626' }}>{rejectedCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Filter */}
      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F8FAFC', px: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={`All Requests (${leaves.length})`} />
            <Tab label={`Pending (${pendingCount})`} />
            <Tab label={`Approved (${approvedCount})`} />
            <Tab label={`Rejected (${rejectedCount})`} />
          </Tabs>
        </Box>

        {/* Requests Table */}
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Company / Department</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Date Range</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.map((leave) => (
              <TableRow key={leave.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{leave.employee_name || 'Staff'}</Typography>
                  <Typography variant="caption" color="text.secondary">{leave.employee_code}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{leave.company_name}</Typography>
                  <Typography variant="caption" color="text.secondary">{leave.department}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={leave.leave_type} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{leave.from_date} to {leave.to_date}</Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 220 }}>
                  <Typography variant="body2" noWrap color="text.secondary">"{leave.reason}"</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={leave.status}
                    size="small"
                    color={leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'error'}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="right">
                  {leave.status === 'Pending' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Approve Request">
                        <IconButton onClick={() => handleUpdateStatus(leave.id, 'Approved')} size="small" sx={{ color: '#059669', bgcolor: '#ECFDF5' }}>
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject Request">
                        <IconButton onClick={() => handleUpdateStatus(leave.id, 'Rejected')} size="small" sx={{ color: '#DC2626', bgcolor: '#FEF2F2' }}>
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">Action Completed</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* New Leave Dialog */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Submit Leave Request</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Select value={empId} onChange={(e) => setEmpId(e.target.value)} fullWidth size="small">
            {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.full_name} ({e.employee_code})</MenuItem>)}
          </Select>
          <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} fullWidth size="small">
            <MenuItem value="Casual Leave">Casual Leave</MenuItem>
            <MenuItem value="Sick Leave">Sick Leave</MenuItem>
            <MenuItem value="Earned Leave">Earned Leave</MenuItem>
            <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
            <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
          </Select>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <TextField label="From Date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="To Date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
          <TextField label="Reason for Leave" value={reason} onChange={(e) => setReason(e.target.value)} fullWidth size="small" multiline rows={3} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddLeave} sx={{ bgcolor: '#059669' }}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
