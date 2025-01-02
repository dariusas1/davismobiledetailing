const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../config/logger');
const { handleDashboardErrors } = require('../middleware/errorHandler');

// Log middleware initialization
console.log('Initializing dashboard routes middleware...');
logger.info('Initializing dashboard routes middleware', {
    timestamp: new Date().toISOString(),
    middlewares: {
        auth: !!authMiddleware,
        upload: !!uploadMiddleware,
        controller: !!DashboardController
    }
});

try {
    // Project Routes
    console.log('Setting up project routes...');
    router.get('/projects', 
        (req, res, next) => {
            console.log('GET /projects: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('GET /projects: Processing request...');
                logger.info('GET /projects request received', {
                    userId: req.user?.id,
                    query: req.query
                });
                const result = await DashboardController.getAllProjects(req, res, next);
                console.log('GET /projects: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('GET /projects: Error processing request:', error);
                logger.error('Error in GET /projects', {
                    error: error.stack,
                    userId: req.user?.id
                });
                next(error);
            }
        }
    );

    router.post('/projects',
        (req, res, next) => {
            console.log('POST /projects: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /projects: Processing file upload...');
            uploadMiddleware.uploadProjectImage.single('projectImage')(req, res, (err) => {
                if (err) {
                    console.error('POST /projects: File upload error:', err);
                    return next(err);
                }
                console.log('POST /projects: File upload successful');
                next();
            });
        },
        (req, res, next) => {
            console.log('POST /projects: Logging upload attempt...');
            uploadMiddleware.logUploadAttempt(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /projects: Handling upload errors...');
            uploadMiddleware.handleUploadErrors(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('POST /projects: Processing request...');
                logger.info('POST /projects request received', {
                    userId: req.user?.id,
                    body: req.body,
                    file: req.file
                });
                const result = await DashboardController.createProject(req, res, next);
                console.log('POST /projects: Request processed successfully');
                res.status(201).json(result);
            } catch (error) {
                console.error('POST /projects: Error processing request:', error);
                logger.error('Error in POST /projects', {
                    error: error.stack,
                    userId: req.user?.id,
                    body: req.body,
                    file: req.file
                });
                next(error);
            }
        }
    );

    router.put('/projects/:id',
        (req, res, next) => {
            console.log('PUT /projects/:id: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /projects/:id: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /projects/:id: Processing file upload...');
            uploadMiddleware.uploadProjectImage.single('projectImage')(req, res, (err) => {
                if (err) {
                    console.error('PUT /projects/:id: File upload error:', err);
                    return next(err);
                }
                console.log('PUT /projects/:id: File upload successful');
                next();
            });
        },
        (req, res, next) => {
            console.log('PUT /projects/:id: Logging upload attempt...');
            uploadMiddleware.logUploadAttempt(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /projects/:id: Handling upload errors...');
            uploadMiddleware.handleUploadErrors(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('PUT /projects/:id: Processing request...');
                logger.info('PUT /projects/:id request received', {
                    userId: req.user?.id,
                    projectId: req.params.id,
                    body: req.body,
                    file: req.file
                });
                const result = await DashboardController.updateProject(req, res, next);
                console.log('PUT /projects/:id: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('PUT /projects/:id: Error processing request:', error);
                logger.error('Error in PUT /projects/:id', {
                    error: error.stack,
                    userId: req.user?.id,
                    projectId: req.params.id,
                    body: req.body,
                    file: req.file
                });
                next(error);
            }
        }
    );

    router.delete('/projects/:id',
        (req, res, next) => {
            console.log('DELETE /projects/:id: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('DELETE /projects/:id: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('DELETE /projects/:id: Processing request...');
                logger.info('DELETE /projects/:id request received', {
                    userId: req.user?.id,
                    projectId: req.params.id
                });
                const result = await DashboardController.deleteProject(req, res, next);
                console.log('DELETE /projects/:id: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('DELETE /projects/:id: Error processing request:', error);
                logger.error('Error in DELETE /projects/:id', {
                    error: error.stack,
                    userId: req.user?.id,
                    projectId: req.params.id
                });
                next(error);
            }
        }
    );

    // Review Routes
    router.get('/reviews',
        (req, res, next) => {
            console.log('GET /reviews: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('GET /reviews: Processing request...');
                logger.info('GET /reviews request received', {
                    userId: req.user?.id,
                    query: req.query
                });
                const result = await DashboardController.getAllReviews(req, res, next);
                console.log('GET /reviews: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('GET /reviews: Error processing request:', error);
                logger.error('Error in GET /reviews', {
                    error: error.stack,
                    userId: req.user?.id
                });
                next(error);
            }
        }
    );

    router.post('/reviews',
        (req, res, next) => {
            console.log('POST /reviews: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /reviews: Processing file upload...');
            uploadMiddleware.uploadReviewImage.fields([{ name: 'reviewImage', maxCount: 1 }])(req, res, (err) => {
                if (err) {
                    console.error('POST /reviews: File upload error:', err);
                    return next(err);
                }
                console.log('POST /reviews: File upload successful');
                next();
            });
        },
        (req, res, next) => {
            console.log('POST /reviews: Logging upload attempt...');
            uploadMiddleware.logUploadAttempt(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /reviews: Handling upload errors...');
            uploadMiddleware.handleUploadErrors(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('POST /reviews: Processing request...');
                logger.info('POST /reviews request received', {
                    userId: req.user?.id,
                    body: req.body,
                    file: req.files
                });
                const result = await DashboardController.createReview(req, res, next);
                console.log('POST /reviews: Request processed successfully');
                res.status(201).json(result);
            } catch (error) {
                console.error('POST /reviews: Error processing request:', error);
                logger.error('Error in POST /reviews', {
                    error: error.stack,
                    userId: req.user?.id,
                    body: req.body,
                    file: req.files
                });
                next(error);
            }
        }
    );

    router.delete('/reviews/:id',
        (req, res, next) => {
            console.log('DELETE /reviews/:id: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('DELETE /reviews/:id: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('DELETE /reviews/:id: Processing request...');
                logger.info('DELETE /reviews/:id request received', {
                    userId: req.user?.id,
                    reviewId: req.params.id
                });
                const result = await DashboardController.deleteReview(req, res, next);
                console.log('DELETE /reviews/:id: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('DELETE /reviews/:id: Error processing request:', error);
                logger.error('Error in DELETE /reviews/:id', {
                    error: error.stack,
                    userId: req.user?.id,
                    reviewId: req.params.id
                });
                next(error);
            }
        }
    );

    // Package Routes
    router.get('/packages',
        (req, res, next) => {
            console.log('GET /packages: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('GET /packages: Processing request...');
                logger.info('GET /packages request received', {
                    userId: req.user?.id,
                    query: req.query
                });
                const result = await DashboardController.getAllPackages(req, res, next);
                console.log('GET /packages: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('GET /packages: Error processing request:', error);
                logger.error('Error in GET /packages', {
                    error: error.stack,
                    userId: req.user?.id
                });
                next(error);
            }
        }
    );

    router.post('/packages',
        (req, res, next) => {
            console.log('POST /packages: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /packages: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /packages: Processing file upload...');
            uploadMiddleware.uploadPackageImage.single('packageImage')(req, res, (err) => {
                if (err) {
                    console.error('POST /packages: File upload error:', err);
                    return next(err);
                }
                console.log('POST /packages: File upload successful');
                next();
            });
        },
        (req, res, next) => {
            console.log('POST /packages: Logging upload attempt...');
            uploadMiddleware.logUploadAttempt(req, res, next);
        },
        (req, res, next) => {
            console.log('POST /packages: Handling upload errors...');
            uploadMiddleware.handleUploadErrors(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('POST /packages: Processing request...');
                logger.info('POST /packages request received', {
                    userId: req.user?.id,
                    body: req.body,
                    file: req.file
                });
                const result = await DashboardController.createPackage(req, res, next);
                console.log('POST /packages: Request processed successfully');
                res.status(201).json(result);
            } catch (error) {
                console.error('POST /packages: Error processing request:', error);
                logger.error('Error in POST /packages', {
                    error: error.stack,
                    userId: req.user?.id,
                    body: req.body,
                    file: req.file
                });
                next(error);
            }
        }
    );

    router.put('/packages/:id',
        (req, res, next) => {
            console.log('PUT /packages/:id: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /packages/:id: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /packages/:id: Processing file upload...');
            uploadMiddleware.uploadPackageImage.single('packageImage')(req, res, (err) => {
                if (err) {
                    console.error('PUT /packages/:id: File upload error:', err);
                    return next(err);
                }
                console.log('PUT /packages/:id: File upload successful');
                next();
            });
        },
        (req, res, next) => {
            console.log('PUT /packages/:id: Logging upload attempt...');
            uploadMiddleware.logUploadAttempt(req, res, next);
        },
        (req, res, next) => {
            console.log('PUT /packages/:id: Handling upload errors...');
            uploadMiddleware.handleUploadErrors(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('PUT /packages/:id: Processing request...');
                logger.info('PUT /packages/:id request received', {
                    userId: req.user?.id,
                    packageId: req.params.id,
                    body: req.body,
                    file: req.file
                });
                const result = await DashboardController.updatePackage(req, res, next);
                console.log('PUT /packages/:id: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('PUT /packages/:id: Error processing request:', error);
                logger.error('Error in PUT /packages/:id', {
                    error: error.stack,
                    userId: req.user?.id,
                    packageId: req.params.id,
                    body: req.body,
                    file: req.file
                });
                next(error);
            }
        }
    );

    router.delete('/packages/:id',
        (req, res, next) => {
            console.log('DELETE /packages/:id: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('DELETE /packages/:id: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('DELETE /packages/:id: Processing request...');
                logger.info('DELETE /packages/:id request received', {
                    userId: req.user?.id,
                    packageId: req.params.id
                });
                const result = await DashboardController.deletePackage(req, res, next);
                console.log('DELETE /packages/:id: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('DELETE /packages/:id: Error processing request:', error);
                logger.error('Error in DELETE /packages/:id', {
                    error: error.stack,
                    userId: req.user?.id,
                    packageId: req.params.id
                });
                next(error);
            }
        }
    );

    // Analytics Routes
    router.get('/analytics',
        (req, res, next) => {
            console.log('GET /analytics: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        (req, res, next) => {
            console.log('GET /analytics: Authorizing admin...');
            authMiddleware.authorizeAdmin(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('GET /analytics: Processing request...');
                logger.info('GET /analytics request received', {
                    userId: req.user?.id,
                    query: req.query
                });
                const result = await DashboardController.getDashboardAnalytics(req, res, next);
                console.log('GET /analytics: Request processed successfully');
                res.status(200).json(result);
            } catch (error) {
                console.error('GET /analytics: Error processing request:', error);
                logger.error('Error in GET /analytics', {
                    error: error.stack,
                    userId: req.user?.id
                });
                next(error);
            }
        }
    );

    // Admin Dashboard Route
    router.get('/admin/dashboard', 
        (req, res, next) => {
            console.log('GET /admin/dashboard: Authenticating user...');
            authMiddleware.authenticateUser(req, res, next);
        },
        async (req, res, next) => {
            try {
                console.log('GET /admin/dashboard: Processing request...');
                logger.info('GET /admin/dashboard request received', {
                    userId: req.user?.id,
                    userRole: req.user?.role
                });

                // Check if user has admin role
                if (req.user.role !== 'admin') {
                    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
                }

                // Fetch admin dashboard data
                const dashboardData = await DashboardController.getAdminDashboardData(req, res, next);

                console.log('GET /admin/dashboard: Request processed successfully');
                res.status(200).json(dashboardData);
            } catch (error) {
                console.error('GET /admin/dashboard: Error processing request:', error);
                logger.error('Error in GET /admin/dashboard', {
                    error: error.stack,
                    userId: req.user?.id
                });
                next(error);
            }
        }
    );

    logger.info('Dashboard routes initialized successfully');
} catch (error) {
    console.error('Error in dashboard routes:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        phase: 'initialization'
    });
    logger.error('Error initializing dashboard routes', {
        error: error.stack,
        details: {
            message: error.message,
            code: error.code,
            phase: 'initialization'
        }
    });
    throw error;
}

// Error handling middleware
router.use((err, req, res, next) => {
    logger.error('Dashboard route error', {
        error: err.stack,
        userId: req.user?.id,
        body: req.body,
        query: req.query,
        params: req.params
    });
    next(err);
});

router.use(handleDashboardErrors);

module.exports = router;
