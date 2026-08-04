import React from 'react';
import { Card, CardActionArea, Box, Typography } from '@mui/material';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string; // e.g. '#059669'
  bgColor?: string;
  trend?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#059669',
  bgColor = '#ECFDF5',
  trend,
  onClick,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-3px)' : 'none',
          boxShadow: onClick ? '0 10px 25px rgba(5, 150, 105, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
          borderColor: onClick ? color : '#E2E8F0',
        },
      }}
    >
      <CardActionArea onClick={onClick} disabled={!onClick} sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              bgcolor: bgColor,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Typography variant="caption" sx={{ color: color, fontWeight: 700, bgcolor: bgColor, px: 1, py: 0.3, borderRadius: '6px' }}>
              {trend}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardActionArea>
    </Card>
  );
};
