import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Menu,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  Business as BusinessIcon,
  FilterList as FilterListIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useFilter } from '../../contexts/FilterContext';
import { dataService } from '../../services/dataService';
import { Company } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSearch, onOpenNotifications }) => {
  const { user, logout, isSupabaseLive } = useAuth();
  const { filters, setCompanyId, resetFilters } = useFilter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dataService.getCompanies().then(setCompanies);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#0F172A',
        borderBottom: '1px solid #E2E8F0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, minHeight: 70 }}>
        {/* Left Section: Mobile Menu toggle & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={onToggleSidebar} edge="start" sx={{ color: '#0F172A', display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              <BusinessIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.2, color: '#0F172A' }}>
                Enterprise Attendance
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                HRMS Admin Portal
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Middle Section: Quick Company Filter & Global Search */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {/* Company Filter Dropdown */}
          <Select
            size="small"
            value={filters.companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start">
                <BusinessIcon sx={{ color: '#059669', fontSize: 20 }} />
              </InputAdornment>
            }
            sx={{
              borderRadius: '12px',
              bgcolor: '#F8FAFC',
              fontSize: '0.875rem',
              fontWeight: 600,
              minWidth: 200,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' },
            }}
          >
            <MenuItem value="all">All Companies ({companies.length})</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.company_name}
              </MenuItem>
            ))}
          </Select>

          {/* Global Search Bar Trigger */}
          <Button
            onClick={onOpenSearch}
            variant="outlined"
            startIcon={<SearchIcon sx={{ color: '#059669' }} />}
            sx={{
              borderRadius: '12px',
              borderColor: '#E2E8F0',
              color: '#64748B',
              bgcolor: '#F8FAFC',
              px: 2,
              py: 0.9,
              fontSize: '0.85rem',
              textTransform: 'none',
              minWidth: 260,
              justifyContent: 'flex-start',
              '&:hover': { borderColor: '#059669', bgcolor: '#FFFFFF' },
            }}
          >
            Search employees, companies, code...
          </Button>
        </Box>

        {/* Right Section: Supabase Badge, Notifications & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Supabase Status Indicator */}
          <Tooltip title={isSupabaseLive ? 'Connected to live Supabase project database' : 'Running in local fallback/demo mode'}>
            <Chip
              icon={isSupabaseLive ? <CloudDoneIcon style={{ color: '#059669' }} /> : <CloudOffIcon style={{ color: '#D97706' }} />}
              label={isSupabaseLive ? 'Supabase Live' : 'Demo Mode'}
              size="small"
              sx={{
                borderRadius: '8px',
                bgcolor: isSupabaseLive ? '#ECFDF5' : '#FEF3C7',
                color: isSupabaseLive ? '#047857' : '#B45309',
                fontWeight: 700,
                fontSize: '0.75rem',
                display: { xs: 'none', sm: 'flex' },
              }}
            />
          </Tooltip>

          {/* Global Search Icon (Mobile) */}
          <IconButton onClick={onOpenSearch} sx={{ color: '#475569', display: { xs: 'flex', md: 'none' } }}>
            <SearchIcon />
          </IconButton>

          {/* Notifications Trigger */}
          <IconButton onClick={onOpenNotifications} sx={{ color: '#475569', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#F1F5F9' } }}>
            <NotificationsIcon />
          </IconButton>

          {/* User Profile Avatar */}
          <Button
            onClick={handleMenuOpen}
            sx={{
              borderRadius: '12px',
              p: 0.5,
              color: '#0F172A',
              textTransform: 'none',
              '&:hover': { bgcolor: '#F8FAFC' },
            }}
          >
            <Avatar src={user?.avatarUrl} sx={{ width: 36, height: 36, border: '2px solid #059669' }} />
            <Box sx={{ ml: 1, textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.1, fontSize: '0.85rem' }}>
                {user?.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                {user?.role || 'Super Admin'}
              </Typography>
            </Box>
          </Button>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{ sx: { width: 220, borderRadius: '14px', mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' } }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
              <PersonIcon sx={{ mr: 1.5, color: '#059669', fontSize: 20 }} />
              Admin Profile
            </MenuItem>

            <MenuItem
              onClick={() => {
                resetFilters();
                handleMenuClose();
              }}
              sx={{ py: 1 }}
            >
              <RefreshIcon sx={{ mr: 1.5, color: '#2563EB', fontSize: 20 }} />
              Reset Filters
            </MenuItem>

            <MenuItem
              onClick={() => {
                logout();
                handleMenuClose();
              }}
              sx={{ py: 1, color: '#DC2626' }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
