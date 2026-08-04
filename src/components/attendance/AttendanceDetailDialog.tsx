import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  PhoneIphone as PhoneIcon,
  BatteryChargingFull as BatteryIcon,
  Wifi as WifiIcon,
  Language as IpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Attendance } from '../../types';

interface AttendanceDetailDialogProps {
  attendance: Attendance | null;
  open: boolean;
  onClose: () => void;
}

export const AttendanceDetailDialog: React.FC<AttendanceDetailDialogProps> = ({ attendance, open, onClose }) => {
  if (!attendance) return null;

  const lat = attendance.punch_in_latitude || 37.7749;
  const lng = attendance.punch_in_longitude || -122.4194;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={attendance.employee_photo} sx={{ width: 48, height: 48, border: '2px solid #059669' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem' }}>
              {attendance.employee_name} ({attendance.employee_code})
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              {attendance.company_name} • {attendance.department} ({attendance.attendance_date})
            </Typography>
          </Box>
        </Box>
        <Chip
          label={attendance.attendance_status}
          color={
            attendance.attendance_status === 'Present'
              ? 'success'
              : attendance.attendance_status === 'Late'
              ? 'warning'
              : 'error'
          }
          sx={{ fontWeight: 700, borderRadius: '8px' }}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#F8FAFC', py: 2.5 }}>
        <Grid container spacing={2.5}>
          {/* Punch Timings & Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#059669', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon fontSize="small" /> Punch Activity Timings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">PUNCH IN TIME</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {attendance.punch_in || 'N/A'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {attendance.late_minutes > 0 ? `Late by ${attendance.late_minutes}m` : 'On Time'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">PUNCH OUT TIME</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {attendance.punch_out || 'Active Session'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {attendance.overtime_minutes > 0 ? `OT: ${attendance.overtime_minutes}m` : 'Standard'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Total Working Duration:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>
                      {Math.floor(attendance.working_minutes / 60)}h {attendance.working_minutes % 60}m ({attendance.working_minutes} mins)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Device & Diagnostics Metadata */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" sx={{ color: '#2563EB' }} /> Device & Telemetry Diagnostics
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">DEVICE MODEL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{attendance.device_model || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">BATTERY LEVEL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BatteryIcon fontSize="inherit" sx={{ color: '#10B981' }} /> {attendance.battery_percentage ? `${attendance.battery_percentage}%` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">INTERNET NETWORK</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WifiIcon fontSize="inherit" sx={{ color: '#6366F1' }} /> {attendance.internet_type || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">IP ADDRESS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IpIcon fontSize="inherit" sx={{ color: '#64748B' }} /> {attendance.ip_address || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">REMARKS & NOTES</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: '#FFFFFF', p: 1, borderRadius: '8px', border: '1px solid #E2E8F0', mt: 0.5 }}>
                    "{attendance.remarks || 'No remarks entered'}"
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Location Verification & Map & Selfie */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', border: '1px solid #E2E8F0', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon fontSize="small" sx={{ color: '#DC2626' }} /> GPS Geofence Verification
                </Typography>
                <Chip
                  icon={attendance.location_verified ? <CheckCircleIcon /> : <WarningIcon />}
                  label={attendance.location_verified ? 'Verified Inside Geofence' : 'Location Alert'}
                  color={attendance.location_verified ? 'success' : 'warning'}
                  size="small"
                  sx={{ borderRadius: '6px', fontWeight: 700 }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary">PUNCH IN ADDRESS</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {attendance.punch_in_address || 'Address unverified'} ({attendance.punch_in_distance ? `${attendance.punch_in_distance}m from office` : 'N/A'})
              </Typography>

              {/* Interactive Google Map iframe */}
              <Box sx={{ width: '100%', height: 160, borderRadius: '10px', overflow: 'hidden', border: '1px solid #CBD5E1', mb: 1.5 }}>
                <iframe
                  title="Punch Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={mapUrl}
                />
              </Box>

              {/* Selfie Verification Image */}
              {attendance.selfie_url && (
                <Box>
                  <Typography variant="caption" color="text.secondary">BIOMETRIC SELFIE SCAN AT PUNCH IN</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1, alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={attendance.selfie_url}
                      alt="Selfie Scan"
                      sx={{ width: 72, height: 72, borderRadius: '12px', objectFit: 'cover', border: '2px solid #059669' }}
                    />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669', display: 'block' }}>
                        ✓ Facial Liveness Verified
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Biometric facial verification matched database profile photo.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#059669', borderRadius: '10px', textTransform: 'none', px: 3 }}>
          Close Verification Dialog
        </Button>
      </DialogActions>
    </Dialog>
  );
};
