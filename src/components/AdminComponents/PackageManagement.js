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
    TextField
} from '@mui/material';
import { AppContext } from '../../App';
import PackageService from '../../services/packageService';

const PackageManagement = () => {
    const [packages, setPackages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const { user } = useContext(AppContext);
    const packageService = new PackageService();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const fetchedPackages = await packageService.fetchAllPackages();
            setPackages(fetchedPackages || []);
        } catch (error) {
            console.error('Failed to fetch packages', error);
        }
    };

    const handleOpenModal = (pkg = null) => {
        setSelectedPackage(pkg);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPackage(null);
    };

    const handleSavePackage = async () => {
        try {
            if (selectedPackage) {
                if (selectedPackage._id) {
                    // Update existing package
                    await packageService.updatePackage(selectedPackage._id, selectedPackage);
                } else {
                    // Create new package
                    await packageService.createPackage(selectedPackage);
                }
                fetchPackages();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Failed to save package', error);
        }
    };

    const handleDeletePackage = async (packageId) => {
        try {
            await packageService.deletePackage(packageId);
            fetchPackages();
        } catch (error) {
            console.error('Failed to delete package', error);
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Package Management
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleOpenModal()}
                sx={{ mb: 2 }}
            >
                Add New Package
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Package Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.map((pkg) => (
                            <TableRow key={pkg._id}>
                                <TableCell>{pkg.name}</TableCell>
                                <TableCell>{pkg.description}</TableCell>
                                <TableCell>${pkg.price}</TableCell>
                                <TableCell>{pkg.duration} hours</TableCell>
                                <TableCell>
                                    <Button 
                                        size="small" 
                                        color="primary" 
                                        onClick={() => handleOpenModal(pkg)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="secondary" 
                                        onClick={() => handleDeletePackage(pkg._id)}
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
                <DialogTitle>
                    {selectedPackage ? 'Edit Package' : 'Add New Package'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Package Name"
                        fullWidth
                        value={selectedPackage?.name || ''}
                        onChange={(e) => setSelectedPackage(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={selectedPackage?.description || ''}
                        onChange={(e) => setSelectedPackage(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={selectedPackage?.price || ''}
                        onChange={(e) => setSelectedPackage(prev => ({
                            ...prev,
                            price: parseFloat(e.target.value)
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Duration (hours)"
                        type="number"
                        fullWidth
                        value={selectedPackage?.duration || ''}
                        onChange={(e) => setSelectedPackage(prev => ({
                            ...prev,
                            duration: parseFloat(e.target.value)
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePackage} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PackageManagement;
