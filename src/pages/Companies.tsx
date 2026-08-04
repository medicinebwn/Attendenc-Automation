import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  MyLocation as RadiusIcon,
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { Company } from '../types';
import { CompanyDetailModal } from '../components/company/CompanyDetailModal';

interface CompaniesProps {
  onSelectCompany: (cmp: Company) => void;
  selectedCompany: Company | null;
}

export const CompaniesPage: React.FC<CompaniesProps> = ({ onSelectCompany, selectedCompany }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // New Company Form State
  const [companyName, setCompanyName] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [allowedRadius, setAllowedRadius] = useState(200);

  const loadData = async () => {
    const list = await dataService.getCompanies();
    setCompanies(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardClick = (cmp: Company) => {
    onSelectCompany(cmp);
    setModalOpen(true);
  };

  const filtered = companies.filter(
    (c) =>
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.company_code.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCompany = async () => {
    await dataService.addCompany({
      company_name: companyName || 'New Branch HQ',
      company_code: companyCode || `CMP-${Math.floor(100 + Math.random() * 900)}`,
      address: address || '100 Enterprise Way, Suite 400',
      latitude: Number(latitude),
      longitude: Number(longitude),
      allowed_radius: Number(allowedRadius),
      is_active: true,
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
            Company Hubs & Geofences ({filtered.length})
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
            Configure corporate offices, GPS coordinates, geofence radius boundaries, and live staffing rates.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
        >
          + Add New Company Hub
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ maxWidth: 400 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Company Name, Code, Location..."
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
      </Box>

      {/* Company Cards Grid */}
      <Grid container spacing={3}>
        {filtered.map((cmp) => {
          const rate = cmp.attendance_percentage || 90;
          return (
            <Grid item xs={12} sm={6} md={4} key={cmp.id}>
              <Card
                elevation={0}
                onClick={() => handleCardClick(cmp)}
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BusinessIcon sx={{ color: '#059669', fontSize: 26 }} />
                    </Box>
                    <Chip label={cmp.company_code} sx={{ bgcolor: '#0F172A', color: '#FFFFFF', fontWeight: 700, borderRadius: '8px' }} />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem', mb: 0.5 }}>
                    {cmp.company_name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.8, mb: 2 }}>
                    <LocationIcon fontSize="inherit" sx={{ color: '#DC2626' }} /> {cmp.address}
                  </Typography>

                  {/* Geofence & Radius Info */}
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <Chip
                      icon={<RadiusIcon fontSize="inherit" />}
                      label={`Allowed Radius: ${cmp.allowed_radius}m`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: '6px', fontWeight: 600 }}
                    />
                    <Chip label="GPS Active" size="small" color="success" sx={{ borderRadius: '6px', fontWeight: 600 }} />
                  </Box>

                  {/* Attendance Stats Progress */}
                  <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                        Attendance Rate: {rate}%
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669' }}>
                        {cmp.present_today || 25} / {cmp.total_employees || 30} Staff
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={rate}
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#059669' } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Company Dashboard Modal */}
      <CompanyDetailModal company={selectedCompany} open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Add Company Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Company Branch</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} fullWidth size="small" required />
          <TextField label="Company Code" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} fullWidth size="small" required />
          <TextField label="Office Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth size="small" multiline rows={2} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Latitude" type="number" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} fullWidth size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Longitude" type="number" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} fullWidth size="small" />
            </Grid>
          </Grid>
          <TextField label="Allowed Geofence Radius (Meters)" type="number" value={allowedRadius} onChange={(e) => setAllowedRadius(Number(e.target.value))} fullWidth size="small" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCompany} sx={{ bgcolor: '#059669' }}>
            Save Company Hub
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
