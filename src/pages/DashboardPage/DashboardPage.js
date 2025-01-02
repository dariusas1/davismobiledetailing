/* eslint-disable no-unused-vars */
import './DashboardPage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Reviews from '../../sections/Dashboard/Reviews';
import Projects from '../../sections/Dashboard/Projects';
import Faqs from '../../sections/Dashboard/Faqs';
import Packages from '../../sections/Dashboard/Packages';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import Logger from '../../utils/Logger';
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Fallback for image compression if library is not available
const compressImage = async (file, options = {}) => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    const mergedOptions = { ...defaultOptions, ...options };

    try {
        // If browser-image-compression is available, use it
        const imageCompression = await import('browser-image-compression');
        return await imageCompression.default(file, mergedOptions);
    } catch (error) {
        // Fallback: return original file if compression fails
        Logger.warn('Image compression failed, using original file', { error: error.message });
        return file;
    }
};

// Fallback for UUID generation if library is not available
const generateUniqueId = () => {
    try {
        const { v4: uuidv4 } = require('uuid');
        return uuidv4();
    } catch (error) {
        // Fallback: generate a simple unique ID
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// Analytics Chart Component
const AnalyticsChart = ({ data, title, type = 'bar' }) => {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    return <Bar options={chartOptions} data={data} />;
};

const DashboardPage = () => {
    const [isProjectsSelected, setIsProjectsSelected] = useState(true);
    const [isPackagesSelected, setIsPackagesSelected] = useState(false);
    const [isFaqsSelected, setIsFaqsSelected] = useState(false);
    const [isReviewsSelected, setIsReviewsSelected] = useState(false);
    const [isImagesSelected, setIsImagesSelected] = useState(false);
    const [isDashboardStatsSelected, setIsDashboardStatsSelected] = useState(false);
    const [isAnalyticsSelected, setIsAnalyticsSelected] = useState(false);

    const projectsClicked = () => {
        setIsProjectsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsImagesSelected(false);
        setIsDashboardStatsSelected(false);
        setIsAnalyticsSelected(false);
    }
    const packagesClicked = () => {
        setIsPackagesSelected(true);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
        setIsImagesSelected(false);
        setIsDashboardStatsSelected(false);
        setIsAnalyticsSelected(false);
    }
    const faqsClicked = () => {
        setIsFaqsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsProjectsSelected(false);
        setIsImagesSelected(false);
        setIsDashboardStatsSelected(false);
        setIsAnalyticsSelected(false);
    }
    const reviewsClicked = () => {
        setIsReviewsSelected(true);
        setIsPackagesSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
        setIsImagesSelected(false);
        setIsDashboardStatsSelected(false);
        setIsAnalyticsSelected(false);
    }
    const imagesClicked = () => {
        setIsImagesSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
        setIsDashboardStatsSelected(false);
        setIsAnalyticsSelected(false);
    }
    const dashboardStatsClicked = () => {
        setIsDashboardStatsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
        setIsImagesSelected(false);
        setIsAnalyticsSelected(false);
    }
    const analyticsClicked = () => {
        setIsAnalyticsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
        setIsImagesSelected(false);
        setIsDashboardStatsSelected(false);
    }

    const {
        logout
    } = useContext(AppContext);

    const ImagesUpload = () => {
        const [selectedFile, setSelectedFile] = useState(null);
        const [uploadProgress, setUploadProgress] = useState(0);
        const [uploadSection, setUploadSection] = useState('gallery'); // Default section
        const [imagePreview, setImagePreview] = useState(null);
        const [uploadedImages, setUploadedImages] = useState([]);
        const [validationError, setValidationError] = useState(null);

        // Image validation function
        const validateImage = (file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            // Check file type
            if (!allowedTypes.includes(file.type)) {
                return 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
            }

            // Check file size
            if (file.size > maxSize) {
                return 'File is too large. Maximum size is 5MB.';
            }

            return null;
        };

        const handleFileSelect = (event) => {
            const file = event.target.files[0];
            
            // Reset previous states
            setValidationError(null);
            setImagePreview(null);

            // Validate file
            const validationResult = validateImage(file);
            if (validationResult) {
                setValidationError(validationResult);
                return;
            }

            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setSelectedFile(file);
        };

        const handleUpload = async () => {
            if (!selectedFile) {
                alert('Please select a file to upload');
                return;
            }

            try {
                // Image compression options
                const compressionOptions = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };

                // Compress image
                const compressedFile = await compressImage(selectedFile, compressionOptions);

                // Upload compressed image
                const formData = new FormData();
                formData.append('image', compressedFile);

                // Replace with your own server-side upload logic
                const response = await fetch('/upload-image', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                // Update local state with new image
                setUploadedImages(prev => [...prev, {
                    id: data.id,
                    name: data.name,
                    url: data.url,
                    section: uploadSection
                }]);

                Logger.info('Image uploaded successfully', { 
                    section: uploadSection, 
                    fileName: selectedFile.name 
                });

                // Reset states
                setSelectedFile(null);
                setImagePreview(null);
                setUploadProgress(0);
                setValidationError(null);
            } catch (error) {
                Logger.error('Image upload process failed', { 
                    error: error.message 
                });
                alert('Upload process failed: ' + error.message);
            }
        };

        const handleBatchUpload = async (files, uploadSection) => {
            try {
                const uploadPromises = Array.from(files).map(file => 
                    handleUpload(file, uploadSection)
                );

                const uploadedImages = await Promise.all(uploadPromises);
                
                // Update UI or perform additional actions
                setUploadedImages(prev => [...prev, ...uploadedImages]);

                return uploadedImages;
            } catch (error) {
                Logger.error('Batch upload failed', { error: error.message });
                throw error;
            }
        };

        return (
            <div className="image-upload-container">
                <h2>Image Upload Management</h2>
                
                {/* Upload Section */}
                <div className="upload-section">
                    <div className="upload-section-selector">
                        <label>
                            Upload Section:
                            <select 
                                value={uploadSection} 
                                onChange={(e) => setUploadSection(e.target.value)}
                            >
                                <option value="gallery">Gallery</option>
                                <option value="home">Home</option>
                                <option value="about">About</option>
                                <option value="services">Services</option>
                                <option value="logo">Logo</option>
                            </select>
                        </label>
                    </div>

                    {/* File Input and Validation */}
                    <div className="file-upload">
                        <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp" 
                            onChange={handleFileSelect} 
                        />
                        {validationError && (
                            <div className="validation-error">
                                {validationError}
                            </div>
                        )}

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="image-preview">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="preview-image" 
                                />
                            </div>
                        )}

                        {/* Upload Button and Progress */}
                        {selectedFile && (
                            <div className="selected-file">
                                <button 
                                    onClick={handleUpload}
                                    disabled={!!validationError}
                                >
                                    Upload
                                </button>
                                {uploadProgress > 0 && (
                                    <div className="upload-progress">
                                        <div 
                                            className="progress-bar" 
                                            style={{width: `${uploadProgress}%`}}
                                        ></div>
                                        <span>{Math.round(uploadProgress)}%</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Uploaded Images Gallery */}
                <div className="uploaded-images-gallery">
                    <h3>Uploaded Images</h3>
                    <div className="gallery-grid">
                        {uploadedImages.map((image) => (
                            <div key={image.id} className="gallery-item">
                                <img 
                                    src={image.url} 
                                    alt={image.name} 
                                    className="gallery-image" 
                                />
                                <div className="gallery-item-details">
                                    <span>{image.name}</span>
                                    <span>Section: {image.section}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const [dashboardStats, setDashboardStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        topServices: [],
        recentCustomers: []
    });

    const [analyticsData, setAnalyticsData] = useState({
        monthlyRevenue: [],
        serviceBreakdown: [],
        customerGrowth: []
    });

    const fetchDashboardStats = async () => {
        try {
            // Fetch booking statistics
            // Replace with your own server-side logic to fetch booking statistics
            const response = await fetch('/fetch-dashboard-stats');
            const data = await response.json();

            setDashboardStats(data);
        } catch (error) {
            Logger.error('Failed to fetch dashboard stats', { error: error.message });
        }
    };

    const fetchAnalyticsData = async () => {
        try {
            // Fetch analytics data
            // Replace with your own server-side logic to fetch analytics data
            const response = await fetch('/fetch-analytics-data');
            const data = await response.json();

            setAnalyticsData(data);
        } catch (error) {
            Logger.error('Failed to fetch analytics data', { error: error.message });
        }
    };

    // Prepare chart data for monthly revenue
    const monthlyRevenueChartData = {
        labels: analyticsData.monthlyRevenue.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: analyticsData.monthlyRevenue.map(item => item.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    // Prepare chart data for service breakdown
    const serviceBreakdownChartData = {
        labels: analyticsData.serviceBreakdown.map(item => item.service),
        datasets: [
            {
                label: 'Service Revenue',
                data: analyticsData.serviceBreakdown.map(item => item.revenue),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ]
    };

    const DashboardStats = () => {
        useEffect(() => {
            fetchDashboardStats();
            fetchAnalyticsData();
        }, []);

        return (
            <div className="dashboard-stats-container">
                <div className="stats-overview">
                    <div className="stat-card">
                        <h3>Total Bookings</h3>
                        <p>{dashboardStats.totalBookings}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p>${dashboardStats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="top-services">
                    <h3>Top Services</h3>
                    <ul>
                        {dashboardStats.topServices.map(([service, count]) => (
                            <li key={service}>
                                {service}: {count} bookings
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="recent-customers">
                    <h3>Recent Customers</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardStats.recentCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.displayName || 'N/A'}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.createdAt.toDate().toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const Analytics = () => {
        return (
            <div className="analytics-container">
                <div className="monthly-revenue">
                    <AnalyticsChart 
                        data={monthlyRevenueChartData} 
                        title="Monthly Revenue" 
                    />
                </div>

                <div className="service-breakdown">
                    <AnalyticsChart 
                        data={serviceBreakdownChartData} 
                        title="Service Breakdown" 
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <Sidebar
                projectsClicked={projectsClicked}
                packagesClicked={packagesClicked}
                faqsClicked={faqsClicked}
                reviewsClicked={reviewsClicked}
                imagesClicked={imagesClicked}
                dashboardStatsClicked={dashboardStatsClicked}
                analyticsClicked={analyticsClicked}
                isProjectsSelected={isProjectsSelected}
                isPackagesSelected={isPackagesSelected}
                isFaqsSelected={isFaqsSelected}
                isReviewsSelected={isReviewsSelected}
                isImagesSelected={isImagesSelected}
                isDashboardStatsSelected={isDashboardStatsSelected}
                isAnalyticsSelected={isAnalyticsSelected}
                logout={logout}
            />
            <section className="dashboard">
                <div className="dashboard-card">
                    {
                        isProjectsSelected
                        &&
                        <Projects />
                    }
                    {
                        isPackagesSelected
                        &&
                        <Packages />
                    }
                    {
                        isFaqsSelected
                        &&
                        <Faqs />
                    }
                    {
                        isReviewsSelected
                        &&
                        <Reviews />
                    }
                    {
                        isImagesSelected
                        &&
                        <ImagesUpload />
                    }
                    {
                        isDashboardStatsSelected
                        &&
                        <DashboardStats />
                    }
                    {
                        isAnalyticsSelected
                        &&
                        <Analytics />
                    }
                </div>
            </section>
        </div>
    )
};

export default DashboardPage;