import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Rating,
    LinearProgress,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot
} from '@mui/lab';
import {
    TrendingUp,
    TrendingDown,
    ThumbUp,
    ThumbDown,
    Star,
    Schedule,
    Message,
    PhotoCamera
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconFilled': {
        color: theme.palette.primary.main
    }
}));

const StatCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const SurveyResults = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/surveys/admin/stats');
                setStats(response.data.data);
                setTimelineData(response.data.data.timeline);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching survey statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const chartData = {
        labels: timelineData.map(item => item._id),
        datasets: [
            {
                label: 'Average Rating',
                data: timelineData.map(item => item.averageRating),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Number of Responses',
                data: timelineData.map(item => item.count),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Survey Response Trends'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {/* Overall Statistics */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Overall Performance
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h3">
                                            {stats.ratings.averageOverall.toFixed(1)}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Average Rating
                                        </Typography>
                                        <StyledRating
                                            value={stats.ratings.averageOverall}
                                            precision={0.1}
                                            readOnly
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h3">
                                            {(stats.satisfaction.recommendationRate * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Would Recommend
                                        </Typography>
                                        <ThumbUp color="primary" />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h3">
                                            {stats.satisfaction.averageReturnLikelihood.toFixed(1)}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Return Likelihood
                                        </Typography>
                                        <TrendingUp color="success" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Detailed Ratings */}
                <Grid item xs={12} md={6}>
                    <StatCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Service Quality Metrics
                            </Typography>
                            <Stack spacing={2}>
                                {Object.entries(stats.ratings)
                                    .filter(([key]) => key !== 'averageOverall')
                                    .map(([key, value]) => (
                                        <Box key={key}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {value.toFixed(1)}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(value / 5) * 100}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </Box>
                                    ))}
                            </Stack>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* Timeline Chart */}
                <Grid item xs={12} md={6}>
                    <StatCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Response Trends
                            </Typography>
                            <Box height={300}>
                                <Line data={chartData} options={chartOptions} />
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* Recent Activity Timeline */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Survey Activity
                            </Typography>
                            <Timeline>
                                {timelineData.slice(-5).map((item, index) => (
                                    <TimelineItem key={item._id}>
                                        <TimelineSeparator>
                                            <TimelineDot color={
                                                item.averageRating >= 4 ? 'success' :
                                                item.averageRating >= 3 ? 'primary' :
                                                'error'
                                            }>
                                                <Star />
                                            </TimelineDot>
                                            {index < timelineData.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography variant="subtitle2">
                                                {item._id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.count} responses, {item.averageRating.toFixed(1)} avg rating
                                            </Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SurveyResults; 