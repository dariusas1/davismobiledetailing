import './Projects.css';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';

const Projects = () => {
    const {
        projectsList,
        getProjectsList
    } = useContext(AppContext);

    useEffect(() => {
        getProjectsList();
    });
    return (
        <section className="projects">
            <div className="projects-heading">
                <p>PROJECTS</p>
                <p>Our Work</p>
            </div>
            <div className={projectsList.length > 0 ? "projects-content" : "projects-content-flex"}>
                {
                    projectsList.length > 0
                        ?
                        projectsList.map((item, i) => (
                            <ProjectCard key={i} title={item.title} imgs={item.imgs} />
                        ))
                        :
                        <p className="projects-content-warning">Projects coming soon, check back later.</p>
                }
            </div>
        </section>
    )
};

export default Projects;
