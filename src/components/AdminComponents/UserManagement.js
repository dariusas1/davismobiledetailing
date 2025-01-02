/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { AppContext } from '../../App';
import UserService from '../../services/userService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { user } = useContext(AppContext);
    const userService = new UserService();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await userService.fetchAllUsers();
            setUsers(fetchedUsers || []);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    const handleUpdateUserRole = async () => {
        try {
            if (selectedUser) {
                await userService.updateUserRole(selectedUser._id, selectedUser.role);
                fetchUsers();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Failed to update user role', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((userData) => (
                            <TableRow key={userData._id}>
                                <TableCell>{userData.username}</TableCell>
                                <TableCell>{userData.email}</TableCell>
                                <TableCell>{userData.role}</TableCell>
                                <TableCell>{new Date(userData.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button 
                                        size="small" 
                                        color="primary" 
                                        onClick={() => handleOpenModal(userData)}
                                    >
                                        Update Role
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="secondary" 
                                        onClick={() => handleDeleteUser(userData._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Update User Role</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={selectedUser?.role || ''}
                            label="Role"
                            onChange={(e) => setSelectedUser(prev => ({
                                ...prev,
                                role: e.target.value
                            }))}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateUserRole} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
