import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import Chart from 'react-apexcharts';
import { dataService } from '../services/dataService';
import { Attendance, Company, Employee } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    dataService.getCompanies().then(setCompanies);
    dataService.getEmployees().then(setEmployees);
  }, []);

  // Heatmap options & data
  const heatMapOptions: ApexCharts.ApexOptions = {
    chart: { type: 'heatmap', toolbar: { show: false } },
    colors: ['#059669'],
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  };

  const heatMapSeries = [
    { name: 'Week 1', data: [94, 98, 92, 96, 90] },
    { name: 'Week 2', data: [96, 95, 91, 98, 94] },
    { name: 'Week 3', data: [92, 90, 88, 94, 91] },
    { name: 'Week 4', data: [98, 99, 95, 97, 93] },
  ];

  // Late Arrival Analysis Bar Chart
  const lateOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    colors: ['#F59E0B'],
    plotOptions: { bar: { borderRadius: 6 } },
    xaxis: { categories: ['Engineering', 'Finance', 'R&D', 'Logistics', 'HR', 'Marketing'] },
  };
  const lateSeries = [{ name: 'Late Arrival Mins', data: [45, 12, 60, 25, 10, 30] }];

  // Overtime Monthly Bar Chart
  const otOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    colors: ['#3B82F6'],
    plotOptions: { bar: { borderRadius: 6 } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
  };
  const otSeries = [{ name: 'Total Overtime Hours', data: [120, 140, 110, 160, 180, 150, 195, 210] }];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.75rem' }}>
          Enterprise Workforce Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.3 }}>
          Deep analytical metrics, heatmaps, late arrival distributions, and monthly overtime trends.
        </Typography>
      </Box>

      {/* KPI Highlights */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" color="text.secondary">AVG PUNCH IN TIME</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669', mt: 0.5 }}>08:52 AM</Typography>
            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>Within 8 min threshold</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" color="text.secondary">AVG PUNCH OUT TIME</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5 }}>06:14 PM</Typography>
            <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600 }}>Full shift compliance</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" color="text.secondary">AVG DAILY WORKING HOURS</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#7C3AED', mt: 0.5 }}>9.1 hrs</Typography>
            <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 600 }}>Optimal productivity</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" color="text.secondary">MONTHLY OVERTIME</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706', mt: 0.5 }}>210 hrs</Typography>
            <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 600 }}>Approved by HR</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Heatmap & Late Arrival Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', mb: 2 }}>
              Monthly Attendance Heat Map (%)
            </Typography>
            <Chart options={heatMapOptions} series={heatMapSeries} type="heatmap" height={280} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', mb: 2 }}>
              Late Arrival Analysis by Department (Total Mins)
            </Typography>
            <Chart options={lateOptions} series={lateSeries} type="bar" height={280} />
          </Paper>
        </Grid>
      </Grid>

      {/* Monthly Overtime Trend */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', border: '1px solid #E2E8F0' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', mb: 2 }}>
          Yearly Overtime Hours Accumulation Trend
        </Typography>
        <Chart options={otOptions} series={otSeries} type="bar" height={280} />
      </Paper>
    </Box>
  );
};
