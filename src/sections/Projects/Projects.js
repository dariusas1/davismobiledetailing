import './Projects.css';
import React from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

const Projects = () => {
    return (
        <section className="projects">
            <div className="projects-heading">
                <p>PROJECTS</p>
                <p>Our Work</p>
            </div>
            <div className="projects-content">
                <ProjectCard projectTitle={"2019 Hellcat"} />
                <ProjectCard projectTitle={"2019 Hellcat"} />
                <ProjectCard projectTitle={"2019 Hellcat"} />
            </div>
        </section>
    )
};

export default Projects;
