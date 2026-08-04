import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FilterProvider } from './contexts/FilterContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AttendancePage } from './pages/Attendance';
import { EmployeesPage } from './pages/Employees';
import { CompaniesPage } from './pages/Companies';
import { LeavesPage } from './pages/Leaves';
import { HolidaysPage } from './pages/Holidays';
import { ReportsPage } from './pages/Reports';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { Employee, Company, Attendance } from './types';

// Custom Enterprise Emerald Theme (Material Design 3)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#059669', // Emerald Green
      light: '#34D399',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F172A', // Dark Slate
      light: '#1E293B',
      dark: '#020617',
    },
    background: {
      default: '#F8FAFC', // Very Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigateTab={setCurrentTab}
            onSelectCompany={(cmp) => {
              setSelectedCompany(cmp);
              setCurrentTab('companies');
            }}
            onSelectEmployee={(emp) => {
              setSelectedEmployee(emp);
              setCurrentTab('employees');
            }}
          />
        );
      case 'attendance':
        return <AttendancePage />;
      case 'employees':
        return (
          <EmployeesPage
            selectedEmployee={selectedEmployee}
            onSelectEmployee={setSelectedEmployee}
          />
        );
      case 'companies':
        return (
          <CompaniesPage
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
          />
        );
      case 'leaves':
        return <LeavesPage />;
      case 'holidays':
        return <HolidaysPage />;
      case 'reports':
        return <ReportsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Dashboard
            onNavigateTab={setCurrentTab}
            onSelectCompany={setSelectedCompany}
            onSelectEmployee={setSelectedEmployee}
          />
        );
    }
  };

  return (
    <MainLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onSelectEmployee={(emp) => {
        setSelectedEmployee(emp);
        setCurrentTab('employees');
      }}
      onSelectCompany={(cmp) => {
        setSelectedCompany(cmp);
        setCurrentTab('companies');
      }}
      onSelectAttendance={() => {
        setCurrentTab('attendance');
      }}
    >
      {renderCurrentTab()}
    </MainLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
