import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const ReminderCard = styled(Card)(({ theme, status }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${
        status === 'overdue' ? theme.palette.error.main :
        status === 'due' ? theme.palette.warning.main :
        status === 'completed' ? theme.palette.success.main :
        theme.palette.info.main
    }`
}));

const ReminderList = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDialog, setEditDialog] = useState({ open: false, reminder: null });
    const [completeDialog, setCompleteDialog] = useState({ open: false, reminder: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/maintenance/my-reminders');
            setReminders(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching reminders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleComplete = async (reminder) => {
        try {
            await axios.post(`/api/maintenance/${reminder._id}/complete`, {
                date: new Date(),
                notes: completeDialog.notes
            });
            setSnackbar({
                open: true,
                message: 'Service marked as completed',
                severity: 'success'
            });
            fetchReminders();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error completing service',
                severity: 'error'
            });
        } finally {
            setCompleteDialog({ open: false, reminder: null, notes: '' });
        }
    };

    const handleUpdate = async (reminder) => {
        try {
            await axios.put(`/api/maintenance/${reminder._id}`, {
                frequency: editDialog.frequency,
                priority: editDialog.priority,
                notificationSettings: editDialog.notificationSettings,
                customInstructions: editDialog.customInstructions
            });
            setSnackbar({
                open: true,
                message: 'Reminder updated successfully',
                severity: 'success'
            });
            fetchReminders();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error updating reminder',
                severity: 'error'
            });
        } finally {
            setEditDialog({ open: false, reminder: null });
        }
    };

    const handleDelete = async (reminderId) => {
        try {
            await axios.delete(`/api/maintenance/${reminderId}`);
            setSnackbar({
                open: true,
                message: 'Reminder deleted successfully',
                severity: 'success'
            });
            fetchReminders();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error deleting reminder',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {reminders.map((reminder) => (
                <ReminderCard key={reminder._id} status={reminder.status}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                    <DirectionsCarIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">
                                        {reminder.vehicle.make} {reminder.vehicle.model}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {reminder.type} - {reminder.frequency.value} {reminder.frequency.unit}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box display="flex" justifyContent="flex-end" alignItems="center">
                                    <Chip
                                        label={reminder.status.toUpperCase()}
                                        color={
                                            reminder.status === 'overdue' ? 'error' :
                                            reminder.status === 'due' ? 'warning' :
                                            reminder.status === 'completed' ? 'success' :
                                            'info'
                                        }
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => setEditDialog({ open: true, ...reminder })}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => setCompleteDialog({ open: true, reminder })}
                                        disabled={reminder.status === 'completed'}
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(reminder._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <NotificationsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Next due: {new Date(reminder.nextDueDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </ReminderCard>
            ))}

            {/* Edit Dialog */}
            <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, reminder: null })}>
                <DialogTitle>Edit Reminder</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Priority"
                                value={editDialog.priority || ''}
                                onChange={(e) => setEditDialog({ ...editDialog, priority: e.target.value })}
                                margin="normal"
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                label="Custom Instructions"
                                value={editDialog.customInstructions || ''}
                                onChange={(e) => setEditDialog({ ...editDialog, customInstructions: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog({ open: false, reminder: null })}>Cancel</Button>
                    <Button onClick={() => handleUpdate(editDialog)} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Complete Dialog */}
            <Dialog open={completeDialog.open} onClose={() => setCompleteDialog({ open: false, reminder: null })}>
                <DialogTitle>Complete Service</DialogTitle>
                <DialogContent>
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        label="Service Notes"
                        value={completeDialog.notes || ''}
                        onChange={(e) => setCompleteDialog({ ...completeDialog, notes: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompleteDialog({ open: false, reminder: null })}>Cancel</Button>
                    <Button onClick={() => handleComplete(completeDialog.reminder)} variant="contained" color="primary">
                        Complete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReminderList; 