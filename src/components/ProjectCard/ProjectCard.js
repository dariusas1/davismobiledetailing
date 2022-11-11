import './ProjectCard.css';
import React from 'react';
import tempCarImg from '../../assets/images/car.jpg';

const ProjectCard = ({projectTitle}) => {
    return (
        <div className="project-card">
            <img src={tempCarImg} alt={projectTitle} />
            <div className="project-card-overlay">
                <button type="button">View</button>
            </div>
        </div>
    )
};

export default ProjectCard;
