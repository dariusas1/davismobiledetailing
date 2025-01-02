import React from 'react';
import { Skeleton } from '@mui/material';
import './ProjectSkeleton.css';

const ProjectSkeleton = ({ count = 3 }) => {
    return (
        <div className="project-skeleton-container">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="project-skeleton-card">
                    <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height={250} 
                        animation="wave" 
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <div className="project-skeleton-content">
                        <Skeleton 
                            variant="text" 
                            width="60%" 
                            height={40} 
                            animation="wave" 
                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                        />
                        <Skeleton 
                            variant="text" 
                            width="40%" 
                            height={30} 
                            animation="wave" 
                            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectSkeleton;
