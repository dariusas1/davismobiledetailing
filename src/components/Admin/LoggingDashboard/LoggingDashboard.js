import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Pagination,
    useTheme,
    alpha
} from '@mui/material';
import {
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const LoggingDashboard = () => {
    const theme = useTheme();
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [logLevel, setLogLevel] = useState('');
    const [page, setPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [logFiles, setLogFiles] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, filesRes] = await Promise.all([
                axios.get('/api/logging/stats'),
                axios.get('/api/logging/files')
            ]);
            setStats(statsRes.data.data);
            setLogFiles(filesRes.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/logging/search', {
                params: {
                    query: searchQuery,
                    level: logLevel,
                    limit: 100
                }
            });
            setLogs(res.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error searching logs');
            setLoading(false);
        }
    };

    const handleFileSelect = async (filename) => {
        try {
            setLoading(true);
            setSelectedFile(filename);
            const res = await axios.get('/api/logging/content', {
                params: {
                    filename,
                    page,
                    limit: 50
                }
            });
            setLogs(res.data.data.logs);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching log content');
            setLoading(false);
        }
    };

    const renderStats = () => {
        if (!stats) return null;

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <ErrorIcon color="error" sx={{ mr: 1 }} />
                                <Typography variant="h6">Errors</Typography>
                            </Box>
                            <Typography variant="h4">{stats.errorCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <WarningIcon color="warning" sx={{ mr: 1 }} />
                                <Typography variant="h6">Warnings</Typography>
                            </Box>
                            <Typography variant="h4">{stats.warningCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <InfoIcon color="info" sx={{ mr: 1 }} />
                                <Typography variant="h6">Info Logs</Typography>
                            </Box>
                            <Typography variant="h4">{stats.infoCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Avg Response Time</Typography>
                            </Box>
                            <Typography variant="h4">
                                {stats.averageResponseTime.toFixed(2)}ms
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    const renderLogViewer = () => {
        return (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell>
                                    <Box
                                        component="span"
                                        sx={{
                                            color: log.level === 'error' ? 'error.main' :
                                                   log.level === 'warn' ? 'warning.main' :
                                                   'info.main'
                                        }}
                                    >
                                        {log.level}
                                    </Box>
                                </TableCell>
                                <TableCell>{log.message}</TableCell>
                                <TableCell>
                                    {log.error && (
                                        <Tooltip title={log.error.stack}>
                                            <IconButton size="small">
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Logging Dashboard</Typography>
                <IconButton onClick={fetchData}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            {renderStats()}

            <Paper sx={{ p: 3, mt: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search Logs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Log Level</InputLabel>
                            <Select
                                value={logLevel}
                                onChange={(e) => setLogLevel(e.target.value)}
                                label="Log Level"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="error">Error</MenuItem>
                                <MenuItem value="warn">Warning</MenuItem>
                                <MenuItem value="info">Info</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Log File</InputLabel>
                            <Select
                                value={selectedFile || ''}
                                onChange={(e) => handleFileSelect(e.target.value)}
                                label="Log File"
                            >
                                {logFiles.map((file) => (
                                    <MenuItem key={file.name} value={file.name}>
                                        {file.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {renderLogViewer()}

                <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                        count={10}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default LoggingDashboard; 