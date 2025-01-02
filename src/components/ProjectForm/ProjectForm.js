import React, { useState, useContext } from 'react';
import { 
    TextField, 
    Button, 
    Grid, 
    Typography, 
    IconButton, 
    Box 
} from '@mui/material';
import { 
    Add as AddIcon, 
    Delete as DeleteIcon, 
    CloudUpload as CloudUploadIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AppContext } from '../../App';
import ErrorHandler from '../../utils/ErrorHandler';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ProjectForm = ({ onClose, onSubmit }) => {
    const { dashboardService, user } = useContext(AppContext);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        tags: [''],
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Project title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
        }

        if (formData.images.length === 0) {
            newErrors.images = 'At least one image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const validImageFiles = files.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
        );

        if (validImageFiles.length !== files.length) {
            ErrorHandler.handleError(
                new Error('Some files were not uploaded. Check file type and size.'), 
                'Image Upload Warning'
            );
        }

        try {
            const uploadPromises = validImageFiles.map(file => 
                dashboardService.uploadImage(file)
            );
            const uploadedImages = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedImages.map(img => img.url)]
            }));
        } catch (error) {
            ErrorHandler.handleError(error, 'Image Upload Failed');
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleAddTag = () => {
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, '']
        }));
    };

    const handleTagChange = (index, value) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        setFormData(prev => ({
            ...prev,
            tags: newTags
        }));
    };

    const handleRemoveTag = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure user is an admin
        if (!user || user.role !== 'admin') {
            ErrorHandler.handleError(
                new Error('Unauthorized'), 
                'Only administrators can create projects'
            );
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const projectData = {
                ...formData,
                createdBy: user.id
            };

            const newProject = await dashboardService.createProject(projectData);
            
            // Call parent submit handler
            onSubmit(newProject);
            
            // Close dialog
            onClose();
        } catch (error) {
            ErrorHandler.handleError(error, 'Project Creation Failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Create New Project</Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Project Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Project Description"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Project Images</Typography>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                            backgroundColor: '#FFD700', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#FFC700' } 
                        }}
                    >
                        Upload Images
                        <VisuallyHiddenInput 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Button>
                    {errors.images && (
                        <Typography color="error" variant="caption">
                            {errors.images}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {formData.images.map((imageUrl, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    position: 'relative', 
                                    width: 100, 
                                    height: 100 
                                }}
                            >
                                <img 
                                    src={imageUrl} 
                                    alt={`Project ${index + 1}`}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover' 
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.5)'
                                    }}
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1">Project Tags</Typography>
                    {formData.tags.map((tag, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                                fullWidth
                                label={`Tag ${index + 1}`}
                                value={tag}
                                onChange={(e) => handleTagChange(index, e.target.value)}
                                sx={{ mr: 1 }}
                            />
                            <IconButton onClick={() => handleRemoveTag(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={handleAddTag}
                        variant="outlined"
                    >
                        Add Tag
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ 
                            backgroundColor: '#FFD700', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#FFC700' } 
                        }}
                    >
                        {isSubmitting ? 'Creating Project...' : 'Create Project'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProjectForm;
