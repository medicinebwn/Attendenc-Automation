import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { Employee, Company, Attendance } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onSelectEmployee?: (emp: Employee) => void;
  onSelectCompany?: (cmp: Company) => void;
  onSelectAttendance?: (att: Attendance) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  onSelectEmployee,
  onSelectCompany,
  onSelectAttendance,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - 260px)` } }}>
        <Header
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
        />

        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 }, flex: 1 }}>
          {children}
        </Container>
      </Box>

      {/* Global Modals */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectEmployee={(emp) => {
          onSelectEmployee?.(emp);
          onSelectTab('employees');
        }}
        onSelectCompany={(cmp) => {
          onSelectCompany?.(cmp);
          onSelectTab('companies');
        }}
        onSelectAttendance={(att) => {
          onSelectAttendance?.(att);
          onSelectTab('attendance');
        }}
      />

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </Box>
  );
};
