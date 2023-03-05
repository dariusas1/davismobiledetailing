import './ProjectsView.css';
import { useEffect, useContext } from 'react';
import { AppContext } from '../../../../App';

const ProjectsView = () => {
    const {
        getProjectsList,
        projectsList,
        deleteProject
    } = useContext(AppContext);

    useEffect(() => {
        getProjectsList();
    });

    return (
        <div className="projects-view">
            {
                projectsList.map(item => (
                    <div key={item.id} className="projects-view-project-card">
                        <img src={item.imgs[0]} alt={item.title} />
                        <div className="projects-view-project-card-overlay">
                            <p>{item.title}</p>
                            <div className="project-card-options">
                                <span className="material-symbols-rounded" onClick={() => deleteProject(item.id)}>delete</span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default ProjectsView;
