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
import DashboardService from '../../services/dashboardService';

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const { user } = useContext(AppContext);
    const dashboardService = new DashboardService();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const fetchedProjects = await dashboardService.fetchProjects();
            setProjects(fetchedProjects || []);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const handleOpenModal = (project = null) => {
        setSelectedProject(project);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProject(null);
    };

    const handleSaveProject = async () => {
        try {
            if (selectedProject) {
                // Update existing project
                await dashboardService.updateProject(selectedProject);
            } else {
                // Create new project
                await dashboardService.createProject(selectedProject);
            }
            fetchProjects();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save project', error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await dashboardService.deleteProject(projectId);
            fetchProjects();
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Project Management
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleOpenModal()}
                sx={{ mb: 2 }}
            >
                Add New Project
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project._id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.description}</TableCell>
                                <TableCell>{project.status}</TableCell>
                                <TableCell>
                                    <Button 
                                        size="small" 
                                        color="primary" 
                                        onClick={() => handleOpenModal(project)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        size="small" 
                                        color="secondary" 
                                        onClick={() => handleDeleteProject(project._id)}
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
                    {selectedProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        fullWidth
                        value={selectedProject?.name || ''}
                        onChange={(e) => setSelectedProject(prev => ({
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
                        value={selectedProject?.description || ''}
                        onChange={(e) => setSelectedProject(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        fullWidth
                        value={selectedProject?.status || ''}
                        onChange={(e) => setSelectedProject(prev => ({
                            ...prev,
                            status: e.target.value
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProject} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectManagement;
