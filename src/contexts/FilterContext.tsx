import React, { createContext, useContext, useState } from 'react';
import { GlobalFilterState } from '../types';

interface FilterContextType {
  filters: GlobalFilterState;
  setCompanyId: (id: string) => void;
  setDepartment: (dept: string) => void;
  setDateRange: (start: string, end: string) => void;
  setSearchQuery: (q: string) => void;
  setStatus: (st: string) => void;
  resetFilters: () => void;
}

const initialFilters: GlobalFilterState = {
  companyId: 'all',
  department: 'all',
  startDate: '',
  endDate: '',
  searchQuery: '',
  status: 'all',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(initialFilters);

  const setCompanyId = (companyId: string) => setFilters(prev => ({ ...prev, companyId }));
  const setDepartment = (department: string) => setFilters(prev => ({ ...prev, department }));
  const setDateRange = (startDate: string, endDate: string) => setFilters(prev => ({ ...prev, startDate, endDate }));
  const setSearchQuery = (searchQuery: string) => setFilters(prev => ({ ...prev, searchQuery }));
  const setStatus = (status: string) => setFilters(prev => ({ ...prev, status }));

  const resetFilters = () => setFilters(initialFilters);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCompanyId,
        setDepartment,
        setDateRange,
        setSearchQuery,
        setStatus,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within a FilterProvider');
  return context;
};
