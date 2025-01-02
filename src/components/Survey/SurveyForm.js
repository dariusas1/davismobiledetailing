import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Rating,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Switch,
    Slider,
    CircularProgress,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconFilled': {
        color: theme.palette.primary.main
    }
}));

const ImagePreview = styled('img')({
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
    marginTop: 8
});

const SurveyForm = ({ surveyId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        ratings: {
            overall: 0,
            serviceQuality: 0,
            timeliness: 0,
            communication: 0,
            valueForMoney: 0,
            staffProfessionalism: 0
        },
        feedback: {
            positives: '',
            improvements: '',
            additionalComments: ''
        },
        satisfaction: {
            wouldRecommend: false,
            likelyToReturn: 5
        },
        serviceSpecific: {
            cleanlinessRating: 0,
            attentionToDetail: 0,
            productQuality: 0
        },
        photos: [],
        isPublic: false
    });

    const handleRatingChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [category]: value
            }
        }));
    };

    const handleServiceSpecificChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            serviceSpecific: {
                ...prev.serviceSpecific,
                [category]: value
            }
        }));
    };

    const handleFeedbackChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            feedback: {
                ...prev.feedback,
                [field]: value
            }
        }));
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = [];

        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                
                const response = await axios.post('/api/upload', formData);
                newPhotos.push({
                    before: response.data.url,
                    after: '',
                    caption: ''
                });
            } catch (err) {
                setError('Error uploading photos. Please try again.');
            }
        }

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...newPhotos]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(`/api/surveys/${surveyId}/submit`, formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting survey');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Box p={3}>
                <Alert severity="success">
                    Thank you for your feedback! You've earned 50 loyalty points.
                </Alert>
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                {/* Overall Ratings */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Service Ratings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography component="legend">Overall Experience</Typography>
                                <StyledRating
                                    value={formData.ratings.overall}
                                    onChange={(e, value) => handleRatingChange('overall', value)}
                                    size="large"
                                />
                            </Grid>
                            {Object.entries(formData.ratings)
                                .filter(([key]) => key !== 'overall')
                                .map(([key, value]) => (
                                    <Grid item xs={12} sm={6} key={key}>
                                        <Typography component="legend">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Typography>
                                        <StyledRating
                                            value={value}
                                            onChange={(e, val) => handleRatingChange(key, val)}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Service Specific Ratings */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Service Details
                        </Typography>
                        <Grid container spacing={3}>
                            {Object.entries(formData.serviceSpecific).map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <Typography component="legend">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </Typography>
                                    <StyledRating
                                        value={value}
                                        onChange={(e, val) => handleServiceSpecificChange(key, val)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Feedback */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Your Feedback
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="What did you like most about our service?"
                                multiline
                                rows={3}
                                value={formData.feedback.positives}
                                onChange={(e) => handleFeedbackChange('positives', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="What could we improve?"
                                multiline
                                rows={3}
                                value={formData.feedback.improvements}
                                onChange={(e) => handleFeedbackChange('improvements', e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Additional Comments"
                                multiline
                                rows={3}
                                value={formData.feedback.additionalComments}
                                onChange={(e) => handleFeedbackChange('additionalComments', e.target.value)}
                                fullWidth
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Satisfaction */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Satisfaction
                        </Typography>
                        <Stack spacing={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.satisfaction.wouldRecommend}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            satisfaction: {
                                                ...prev.satisfaction,
                                                wouldRecommend: e.target.checked
                                            }
                                        }))}
                                    />
                                }
                                label="Would you recommend our service to others?"
                            />
                            <Box>
                                <Typography gutterBottom>
                                    How likely are you to return for our services? (1-10)
                                </Typography>
                                <Slider
                                    value={formData.satisfaction.likelyToReturn}
                                    onChange={(e, value) => setFormData(prev => ({
                                        ...prev,
                                        satisfaction: {
                                            ...prev.satisfaction,
                                            likelyToReturn: value
                                        }
                                    }))}
                                    min={1}
                                    max={10}
                                    marks
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Photos
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                        >
                            Upload Photos
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                            />
                        </Button>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {formData.photos.map((photo, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Box position="relative">
                                        <ImagePreview src={photo.before} alt={`Photo ${index + 1}`} />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'background.paper'
                                            }}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                photos: prev.photos.filter((_, i) => i !== index)
                                            }))}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Submit */}
                <Box>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isPublic}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    isPublic: e.target.checked
                                }))}
                            />
                        }
                        label="Make this review public"
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
                    </Button>
                </Box>
            </Stack>
        </form>
    );
};

export default SurveyForm; 