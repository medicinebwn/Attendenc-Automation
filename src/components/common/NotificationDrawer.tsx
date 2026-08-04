import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Badge,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  EventBusy as EventBusyIcon,
  Celebration as CelebrationIcon,
  CheckCircle as CheckCircleIcon,
  NotificationsNone as NotificationsIcon,
} from '@mui/icons-material';
import { NotificationItem } from '../../types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Late Arrival Alert',
    message: 'Elena Rostova (EMP-1003) checked in 35 minutes late today at BioGenix Oxford Lab.',
    type: 'late',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Pending Leave Request',
    message: 'Robert Vance submitted a Sick Leave request for 3 days starting yesterday.',
    type: 'leave',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Upcoming Company Holiday',
    message: 'UK Bank Holiday scheduled for BioGenix Life Sciences on Aug 31, 2026.',
    type: 'holiday',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 'n-4',
    title: 'Location Verification Success',
    message: 'Sarah Jenkins checked in within 18m of Cyber City office perimeter.',
    type: 'attendance',
    timestamp: 'Today 08:52 AM',
    read: true,
  },
  {
    id: 'n-5',
    title: 'Supabase Sync Ready',
    message: 'Enterprise schema tables mapped cleanly. Environment fallback active.',
    type: 'system',
    timestamp: 'Today 08:00 AM',
    read: true,
  },
];

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setItems(items.map(i => ({ ...i, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'late':
        return <WarningIcon sx={{ color: '#D97706' }} />;
      case 'leave':
        return <EventBusyIcon sx={{ color: '#2563EB' }} />;
      case 'holiday':
        return <CelebrationIcon sx={{ color: '#9333EA' }} />;
      case 'attendance':
        return <CheckCircleIcon sx={{ color: '#059669' }} />;
      default:
        return <NotificationsIcon sx={{ color: '#64748B' }} />;
    }
  };

  const unreadCount = items.filter(i => !i.read).length;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: 320, sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ color: '#059669' }} />
          </Badge>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
            System Notifications
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {unreadCount > 0 && (
        <Box sx={{ px: 2, py: 1, bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {unreadCount} unread alerts
          </Typography>
          <Button size="small" onClick={markAllRead} sx={{ fontSize: '0.75rem', color: '#059669' }}>
            Mark all read
          </Button>
        </Box>
      )}

      <List sx={{ p: 0, flex: 1, overflowY: 'auto' }}>
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <ListItem
              sx={{
                alignItems: 'flex-start',
                bgcolor: item.read ? 'transparent' : '#ECFDF5',
                py: 2,
                px: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>{getIcon(item.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: item.read ? 600 : 700, color: '#0F172A' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                      {item.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                    {item.message}
                  </Typography>
                }
              />
            </ListItem>
            {idx < items.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};
