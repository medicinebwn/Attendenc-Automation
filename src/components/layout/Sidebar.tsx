import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccessTime as AttendanceIcon,
  People as EmployeesIcon,
  Business as CompaniesIcon,
  EventBusy as LeavesIcon,
  CalendarMonth as HolidaysIcon,
  Assessment as ReportsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'attendance', label: 'Attendance', icon: <AttendanceIcon />, badge: 'Live' },
  { id: 'employees', label: 'Employees', icon: <EmployeesIcon /> },
  { id: 'companies', label: 'Companies', icon: <CompaniesIcon /> },
  { id: 'leaves', label: 'Leaves', icon: <LeavesIcon />, badge: '1 Pending' },
  { id: 'holidays', label: 'Holidays', icon: <HolidaysIcon /> },
  { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, mobileOpen, onMobileClose }) => {
  const { logout } = useAuth();

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0F172A', color: '#F8FAFC' }}>
      {/* Sidebar Header Brand */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #334155' }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActiveIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem', lineHeight: 1.2 }}>
            PMBJK
          </Typography>
          <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 700, fontSize: '0.72rem' }}>
            Attendance Automation
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ flex: 1, py: 2, px: 2, overflowY: 'auto' }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, px: 1.5, mb: 1, display: 'block' }}>
          MAIN MENU
        </Typography>
        <List size="small" disablePadding>
          {NAV_ITEMS.map((item) => {
            const isSelected = currentTab === item.id;
            return (
              <ListItemButton
                key={item.id}
                selected={isSelected}
                onClick={() => {
                  onSelectTab(item.id);
                  onMobileClose();
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 0.8,
                  py: 1.2,
                  px: 2,
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  bgcolor: isSelected ? '#059669' : 'transparent',
                  '&.Mui-selected': {
                    bgcolor: '#059669',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#047857' },
                  },
                  '&:hover': {
                    bgcolor: isSelected ? '#047857' : 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isSelected ? '#FFFFFF' : '#64748B' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      bgcolor: isSelected ? '#FFFFFF' : item.badge.includes('Pending') ? '#EF4444' : '#10B981',
                      color: isSelected ? '#059669' : '#FFFFFF',
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #334155' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            borderRadius: '10px',
            borderColor: '#334155',
            color: '#F87171',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            '&:hover': {
              borderColor: '#EF4444',
              bgcolor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
        >
          Logout Admin
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', borderRight: 'none' },
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};
