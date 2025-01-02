import './Projects.css';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectSkeleton from '../../components/ProjectSkeleton/ProjectSkeleton';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import { AppContext } from '../../App';
import { useContext, useEffect, useState, useCallback } from 'react';
import React from 'react';
import { 
    Swiper, 
    SwiperSlide, 
    Pagination, 
    Navigation 
} from '../../utils/swiperConfig';
import { 
    Button, 
    Dialog, 
    DialogContent,
    Pagination as MuiPagination,
    Box
} from '@mui/material';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { toast } from 'react-toastify';

// Simple in-memory cache with advanced features
const ProjectCache = {
    _cache: new Map(),
    _timestamp: new Map(),
    
    set(key, data) {
        this._cache.set(key, data);
        this._timestamp.set(key, Date.now());
    },
    
    get(key) {
        // Cache expires after 15 minutes
        const CACHE_DURATION = 15 * 60 * 1000;
        const cachedData = this._cache.get(key);
        const timestamp = this._timestamp.get(key);
        
        if (cachedData && (Date.now() - timestamp) < CACHE_DURATION) {
            return cachedData;
        }
        
        return null;
    },
    
    clear(key = null) {
        if (key) {
            this._cache.delete(key);
            this._timestamp.delete(key);
        } else {
            this._cache.clear();
            this._timestamp.clear();
        }
    }
};

const Projects = () => {
    const {
        user,
        dashboardService
    } = useContext(AppContext);

    const [projectsList, setProjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [projectsPerPage] = useState(6);

    const loadProjects = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            // Check cache first
            const cacheKey = `projects_page_${page}`;
            const cachedProjects = ProjectCache.get(cacheKey);
            
            if (cachedProjects) {
                setProjectsList(cachedProjects.projects);
                setTotalPages(cachedProjects.totalPages);
                setIsLoading(false);
                return;
            }

            // Fetch projects with pagination
            const options = {
                page,
                limit: projectsPerPage,
                sortBy: 'createdAt',
                order: 'desc'
            };

            const response = await dashboardService.fetchProjects(options);
            
            if (response && response.length > 0) {
                // Simulate total pages (in real scenario, this would come from backend)
                const totalProjectsCount = response.length;
                const calculatedTotalPages = Math.ceil(totalProjectsCount / projectsPerPage);

                setProjectsList(response);
                setTotalPages(calculatedTotalPages);
                
                // Cache the result
                ProjectCache.set(cacheKey, {
                    projects: response,
                    totalPages: calculatedTotalPages
                });
            } else {
                setError('No projects found. Check back later.');
            }
        } catch (fetchError) {
            console.error('Failed to load projects', fetchError);
            setError('Unable to load projects. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    }, [dashboardService, projectsPerPage]);

    useEffect(() => {
        loadProjects(currentPage);
    }, [loadProjects, currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleCreateProject = () => {
        setIsCreateProjectDialogOpen(true);
    };

    const handleCloseCreateProjectDialog = () => {
        setIsCreateProjectDialogOpen(false);
    };

    const handleProjectSubmit = async (newProject) => {
        try {
            // Invalidate cache to force reload
            ProjectCache.clear();
            
            // Reload projects
            await loadProjects(currentPage);

            // Show success toast
            toast.success('Project created successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error('Failed to refresh projects after creation', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <ProjectSkeleton count={projectsPerPage} />;
        }

        if (error) {
            return (
                <div className="projects-error">
                    <p>{error}</p>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => loadProjects(currentPage)}
                    >
                        Retry Loading
                    </Button>
                </div>
            );
        }

        if (!projectsList || projectsList.length === 0) {
            return (
                <div className="projects-content-no-project">
                    <p className="projects-content-warning">Projects coming soon, check back later.</p>
                </div>
            );
        }

        return (
            <div className="projects-content">
                <Swiper
                    slidesPerView={3}
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        700: { slidesPerView: 2 },
                        1000: { slidesPerView: 3 }
                    }}
                    speed={750}
                >
                    {projectsList.map((item) => (
                        <SwiperSlide key={item.id}>
                            <ProjectCard 
                                title={item.title} 
                                imgs={item.images || []} 
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };

    return (
        <section className="projects">
            <div className="projects-header">
                <div className="projects-heading">
                    <p>PROJECTS</p>
                    <p>Our Work</p>
                </div>
                {user && user.role === 'admin' && (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCreateProject}
                        sx={{ 
                            backgroundColor: '#FFD700', 
                            color: 'black',
                            '&:hover': { backgroundColor: '#FFC700' } 
                        }}
                    >
                        Create Project
                    </Button>
                )}
            </div>

            {renderContent()}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                    <MuiPagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                    />
                </Box>
            )}

            {/* Create Project Dialog */}
            <Dialog 
                open={isCreateProjectDialogOpen} 
                onClose={handleCloseCreateProjectDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <ProjectForm 
                        onClose={handleCloseCreateProjectDialog}
                        onSubmit={handleProjectSubmit}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Projects;