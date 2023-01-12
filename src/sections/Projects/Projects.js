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
    }, []);
    return (
        <section className="projects">
            <div className="projects-heading">
                <p>PROJECTS</p>
                <p>Our Work</p>
            </div>
            <div className="projects-content">
                {
                    projectsList.map((item, i) => (
                        <ProjectCard key={i} title={item.title} img={item.img} />
                    ))
                }
            </div>
        </section>
    )
};

export default Projects;
