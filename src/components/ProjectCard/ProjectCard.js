import './ProjectCard.css';
import { useState, useEffect } from 'react';
import ProjModal from '../ProjModal/ProjModal';

const ProjectCard = ({ title, img }) => {
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isActive]);
    return (
        <>
            <div className="project-card">
                <img src={img} alt={title} />
                <div className="project-card-overlay">
                    <button type="button" onClick={() => setIsActive(true)}>View</button>
                </div>
            </div>
            {
                isActive && <ProjModal setIsActive={setIsActive} title={title} />
            }
        </>
    )
};

export default ProjectCard;
