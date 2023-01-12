import './ProjectCard.css';

const ProjectCard = ({ title, img }) => {
    return (
        <div className="project-card">
            <img src={img} alt={title} />
            <div className="project-card-overlay">
                <button type="button">View</button>
            </div>
        </div>
    )
};

export default ProjectCard;
