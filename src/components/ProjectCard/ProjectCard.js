import './ProjectCard.css';
import { AppContext } from '../../App';
import { useContext } from 'react';

const ProjectCard = ({ title, imgs }) => {
    const {
        setIsProjModalActive,
        setProjectInfo
    } = useContext(AppContext);

    const viewProject = () => {
        setIsProjModalActive(true);
        setProjectInfo({ title: title, imgs: imgs });
    };

    return (
        <>
            <div className="project-card">

                <img src={imgs[0]} alt={title} />

                <div className="project-card-overlay">
                    <button type="button" onClick={viewProject}>View</button>
                </div>
            </div>
        </>
    )
};

export default ProjectCard;
