import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { login, isSupabaseLive } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setErrorMsg('Invalid credentials. For development, use Username: admin and Password: admin@1234');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin@1234');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: 'radial-gradient(circle at 50% 10%, #1E293B 0%, #0F172A 70%)',
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: '24px',
          bgcolor: '#FFFFFF',
          p: { xs: 2, sm: 3 },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent>
          {/* Logo Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                bgcolor: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(5, 150, 105, 0.3)',
                mb: 1.5,
              }}
            >
              <BusinessIcon sx={{ color: '#FFFFFF', fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              Enterprise HRMS Admin
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Employee Attendance & GPS Verification Admin Portal
            </Typography>
          </Box>

          {/* Development Credentials Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '14px',
              bgcolor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <KeyIcon sx={{ color: '#059669', mt: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#047857' }}>
                Development Admin Credentials
              </Typography>
              <Typography variant="caption" sx={{ color: '#065F46', display: 'block', mt: 0.3 }}>
                Username: <b>admin</b> | Password: <b>admin@1234</b>
              </Typography>
              <Button
                size="small"
                onClick={fillDemoAdmin}
                sx={{
                  mt: 0.8,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  bgcolor: '#059669',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  py: 0.3,
                  px: 1.2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#047857' },
                }}
              >
                Auto-Fill Credentials
              </Button>
            </Box>
          </Paper>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Admin Username / Email"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#059669' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '14px', bgcolor: '#F8FAFC' },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#059669' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '14px', bgcolor: '#F8FAFC' },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: '14px',
                  bgcolor: '#059669',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                  '&:hover': { bgcolor: '#047857' },
                }}
              >
                {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Chip
              icon={<CheckIcon style={{ color: '#059669' }} />}
              label={isSupabaseLive ? 'Connected to Supabase Project' : 'Local Sandbox Mode Active'}
              size="small"
              sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
