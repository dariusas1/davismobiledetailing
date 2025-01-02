const Project = require('../models/Project');
const Review = require('../models/Review');
const Package = require('../models/Package');
const logger = require('../config/logger');
const { ValidationError, NotFoundError } = require('../middleware/errorHandler');

class DashboardController {
    // Project Methods
    static async getAllProjects(req, res, next) {
        try {
            const projects = await Project.find({}).sort({ createdAt: -1 });
            
            logger.info('Projects retrieved successfully', { 
                count: projects.length,
                userId: req.user.id 
            });

            return {
                success: true,
                count: projects.length,
                data: projects
            };
        } catch (error) {
            logger.error('Error retrieving projects', { 
                error: error.message,
                userId: req.user.id 
            });
            throw error;
        }
    }

    static async createProject(req, res, next) {
        try {
            const { title, description, category } = req.body;
            
            // Validate input
            if (!title || !description) {
                throw new ValidationError('Title and description are required');
            }

            const projectData = {
                title,
                description,
                category,
                imageUrl: req.file ? req.file.path : null,
                createdBy: req.user.id
            };

            const project = new Project(projectData);
            await project.save();

            logger.info('Project created successfully', {
                projectId: project._id,
                userId: req.user.id
            });

            return {
                success: true,
                data: project
            };
        } catch (error) {
            logger.error('Error creating project', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async updateProject(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (req.file) {
                updates.imageUrl = req.file.path;
            }

            const project = await Project.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!project) {
                throw new NotFoundError('Project not found');
            }

            logger.info('Project updated successfully', {
                projectId: id,
                userId: req.user.id
            });

            return {
                success: true,
                data: project
            };
        } catch (error) {
            logger.error('Error updating project', {
                error: error.message,
                projectId: req.params.id,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async deleteProject(req, res, next) {
        try {
            const { id } = req.params;
            const project = await Project.findByIdAndDelete(id);

            if (!project) {
                throw new NotFoundError('Project not found');
            }

            logger.info('Project deleted successfully', {
                projectId: id,
                userId: req.user.id
            });

            return {
                success: true,
                message: 'Project deleted successfully'
            };
        } catch (error) {
            logger.error('Error deleting project', {
                error: error.message,
                projectId: req.params.id,
                userId: req.user.id
            });
            throw error;
        }
    }

    // Review Methods
    static async getAllReviews(req, res, next) {
        try {
            const reviews = await Review.find({}).sort({ createdAt: -1 });

            logger.info('Reviews retrieved successfully', {
                count: reviews.length,
                userId: req.user.id
            });

            return {
                success: true,
                count: reviews.length,
                data: reviews
            };
        } catch (error) {
            logger.error('Error retrieving reviews', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async createReview(req, res, next) {
        try {
            const { rating, comment, customerName } = req.body;

            if (!rating || !comment || !customerName) {
                throw new ValidationError('Rating, comment, and customer name are required');
            }

            const reviewData = {
                rating,
                comment,
                customerName,
                imageUrl: req.file ? req.file.path : null,
                createdBy: req.user.id
            };

            const review = new Review(reviewData);
            await review.save();

            logger.info('Review created successfully', {
                reviewId: review._id,
                userId: req.user.id
            });

            return {
                success: true,
                data: review
            };
        } catch (error) {
            logger.error('Error creating review', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async deleteReview(req, res, next) {
        try {
            const { id } = req.params;
            const review = await Review.findByIdAndDelete(id);

            if (!review) {
                throw new NotFoundError('Review not found');
            }

            logger.info('Review deleted successfully', {
                reviewId: id,
                userId: req.user.id
            });

            return {
                success: true,
                message: 'Review deleted successfully'
            };
        } catch (error) {
            logger.error('Error deleting review', {
                error: error.message,
                reviewId: req.params.id,
                userId: req.user.id
            });
            throw error;
        }
    }

    // Package Methods
    static async getAllPackages(req, res, next) {
        try {
            const packages = await Package.find({}).sort({ createdAt: -1 });

            logger.info('Packages retrieved successfully', {
                count: packages.length,
                userId: req.user.id
            });

            return {
                success: true,
                count: packages.length,
                data: packages
            };
        } catch (error) {
            logger.error('Error retrieving packages', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async createPackage(req, res, next) {
        try {
            const { name, description, price, features } = req.body;

            if (!name || !description || !price) {
                throw new ValidationError('Name, description, and price are required');
            }

            const packageData = {
                name,
                description,
                price,
                features: features || [],
                imageUrl: req.file ? req.file.path : null,
                createdBy: req.user.id
            };

            const newPackage = new Package(packageData);
            await newPackage.save();

            logger.info('Package created successfully', {
                packageId: newPackage._id,
                userId: req.user.id
            });

            return {
                success: true,
                data: newPackage
            };
        } catch (error) {
            logger.error('Error creating package', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async updatePackage(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (req.file) {
                updates.imageUrl = req.file.path;
            }

            const updatedPackage = await Package.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            );

            if (!updatedPackage) {
                throw new NotFoundError('Package not found');
            }

            logger.info('Package updated successfully', {
                packageId: updatedPackage._id,
                userId: req.user.id
            });

            return {
                success: true,
                data: updatedPackage
            };
        } catch (error) {
            logger.error('Error updating package', {
                error: error.message,
                packageId: req.params.id,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async deletePackage(req, res, next) {
        try {
            const { id } = req.params;

            const deletedPackage = await Package.findByIdAndDelete(id);

            if (!deletedPackage) {
                throw new NotFoundError('Package not found');
            }

            logger.info('Package deleted successfully', {
                packageId: id,
                userId: req.user.id
            });

            return {
                success: true,
                data: deletedPackage
            };
        } catch (error) {
            logger.error('Error deleting package', {
                error: error.message,
                packageId: req.params.id,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async getDashboardAnalytics(req, res, next) {
        try {
            const [projects, reviews, packages] = await Promise.all([
                Project.countDocuments(),
                Review.countDocuments(),
                Package.countDocuments()
            ]);

            const analytics = {
                totalProjects: projects,
                totalReviews: reviews,
                totalPackages: packages
            };

            logger.info('Dashboard analytics retrieved successfully', {
                userId: req.user.id,
                analytics
            });

            return {
                success: true,
                data: analytics
            };
        } catch (error) {
            logger.error('Error retrieving dashboard analytics', {
                error: error.message,
                userId: req.user.id
            });
            throw error;
        }
    }

    static async getAdminDashboardData(req, res, next) {
        try {
            // Fetch key metrics for admin dashboard
            const projectCount = await Project.countDocuments({});
            const reviewCount = await Review.countDocuments({});
            const packageCount = await Package.countDocuments({});
            
            // Get recent projects
            const recentProjects = await Project.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title description createdAt');
            
            // Get recent reviews
            const recentReviews = await Review.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('customer', 'username');
            
            // Compile dashboard data
            const dashboardData = {
                metrics: {
                    totalProjects: projectCount,
                    totalReviews: reviewCount,
                    totalPackages: packageCount
                },
                recentProjects,
                recentReviews
            };

            logger.info('Admin dashboard data retrieved successfully', { 
                userId: req.user.id 
            });

            return {
                success: true,
                data: dashboardData
            };
        } catch (error) {
            logger.error('Error retrieving admin dashboard data', { 
                error: error.message,
                userId: req.user.id 
            });
            throw error;
        }
    }
}

module.exports = DashboardController;
