import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Celebration as HolidayIcon,
  Add as AddIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { Holiday, Company } from '../types';

export const HolidaysPage: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCmp, setFilterCmp] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  // Form State
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('2026-09-07');
  const [companyId, setCompanyId] = useState<string | null>(null);

  const loadData = async () => {
    const list = await dataService.getHolidays(filterCmp);
    const cmps = await dataService.getCompanies();
    setHolidays(list);
    setCompanies(cmps);
  };

  useEffect(() => {
    loadData();
  }, [filterCmp]);

  const handleAddHoliday = async () => {
    const selectedCmp = companies.find((c) => c.id === companyId);
    await dataService.addHoliday({
      holiday_name: holidayName || 'Annual Company Holiday',
      holiday_date: holidayDate,
      company_id: companyId,
      company_name: selectedCmp?.company_name || 'All Companies',
    });
    setAddOpen(false);
    loadData();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
            Company Holiday Calendar
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Manage official corporate holidays, bank holidays, and regional observances.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            size="small"
            value={filterCmp}
            onChange={(e) => setFilterCmp(e.target.value)}
            sx={{ borderRadius: '10px', bgcolor: '#FFFFFF', minWidth: 200 }}
          >
            <MenuItem value="all">All Companies</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.company_name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
            sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            + Add Holiday
          </Button>
        </Box>
      </Box>

      {/* Holiday Cards Grid */}
      <Grid container spacing={2.5}>
        {holidays.map((hol) => (
          <Grid item xs={12} sm={6} md={4} key={hol.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                p: 1,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HolidayIcon sx={{ color: '#9333EA', fontSize: 24 }} />
                  </Box>
                  <Chip
                    label={hol.company_name || 'All Companies'}
                    size="small"
                    sx={{ bgcolor: '#F1F5F9', color: '#0F172A', fontWeight: 700, borderRadius: '6px' }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', mb: 0.5 }}>
                  {hol.holiday_name}
                </Typography>

                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CalendarIcon fontSize="inherit" /> Date: {hol.holiday_date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Holiday Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule New Holiday</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Holiday Title / Event" value={holidayName} onChange={(e) => setHolidayName(e.target.value)} fullWidth size="small" required />
          <TextField label="Holiday Date" type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} required />
          <Select value={companyId || 'global'} onChange={(e) => setCompanyId(e.target.value === 'global' ? null : e.target.value)} fullWidth size="small">
            <MenuItem value="global">All Companies (Global Holiday)</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.company_name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHoliday} sx={{ bgcolor: '#059669' }}>Save Holiday</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
