import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { resetDemoData } from '../services/dataService';

export const SettingsPage: React.FC = () => {
  const { user, isSupabaseLive } = useAuth();
  const [appName, setAppName] = useState('Enterprise Employee Attendance Admin');
  const [savedMsg, setSavedMsg] = useState('');

  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');

  const handleSaveSettings = () => {
    setSavedMsg('Settings updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset demo data back to factory defaults?')) {
      resetDemoData();
      window.location.reload();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 900, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
          System & Database Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
          Configure Supabase project environment variables, portal branding, and admin profile preferences.
        </Typography>
      </Box>

      {savedMsg && (
        <Alert severity="success" sx={{ borderRadius: '12px' }}>
          {savedMsg}
        </Alert>
      )}

      {/* Supabase Connection Panel */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SecurityIcon sx={{ color: '#059669', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Supabase Backend Integration
            </Typography>
          </Box>
          <Chip
            icon={isSupabaseLive ? <CloudDoneIcon style={{ color: '#059669' }} /> : <CloudOffIcon style={{ color: '#D97706' }} />}
            label={isSupabaseLive ? 'Connected to Supabase' : 'Offline / Demo Mode Active'}
            color={isSupabaseLive ? 'success' : 'warning'}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Your Supabase database contains the 6 existing tables: <code>companies</code>, <code>employees</code>, <code>employee_company_mapping</code>, <code>attendance</code>, <code>leave_requests</code>, <code>holidays</code>.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="VITE_SUPABASE_URL"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              fullWidth
              size="small"
              placeholder="https://your-project.supabase.co"
              helperText="Set in your .env or Environment Variables panel"
              InputProps={{ sx: { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="VITE_SUPABASE_ANON_KEY"
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              fullWidth
              size="small"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              helperText="Public anonymous API key for table queries"
              InputProps={{ sx: { borderRadius: '10px' } }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Development Credentials & Security */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>
          Admin Authentication & Security
        </Typography>

        <Alert severity="info" sx={{ borderRadius: '12px', mb: 2 }}>
          <b>Temporary Development Login:</b> Username: <code>admin</code> | Password: <code>admin@1234</code>
        </Alert>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Avatar src={user?.avatarUrl} sx={{ width: 54, height: 54, border: '2px solid #059669' }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Role: {user?.role} | Email: {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Application Customization */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
          Portal Branding & Customization
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Application Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ sx: { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch defaultChecked color="success" />} label="Enable Live Geofence Notifications" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch defaultChecked color="success" />} label="Auto-calculate Daily Overtime Minutes" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" color="error" startIcon={<RefreshIcon />} onClick={handleResetData} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Reset Demo Seed Data
          </Button>

          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveSettings} sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', px: 3, fontWeight: 700 }}>
            Save Settings
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
