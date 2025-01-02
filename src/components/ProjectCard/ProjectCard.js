import './ProjectCard.css';
import { AppContext } from '../../App';
import { useContext, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProjectCard = ({ title, imgs = [] }) => {
    const {
        setIsProjModalActive,
        setProjectInfo
    } = useContext(AppContext);

    const [imageLoadError, setImageLoadError] = useState(false);

    const viewProject = () => {
        setIsProjModalActive(true);
        setProjectInfo({ 
            title: title || 'Untitled Project', 
            imgs: Array.isArray(imgs) ? imgs : [] 
        });
    };

    // Fallback image if no images or invalid input
    const displayImage = !imageLoadError && Array.isArray(imgs) && imgs.length > 0 
        ? imgs[0] 
        : 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <div className="project-card">
            <LazyLoadImage 
                src={displayImage} 
                alt={title || 'Project'} 
                effect="blur"
                threshold={300}
                onError={() => setImageLoadError(true)}
                className="project-card-image"
                placeholderSrc="https://via.placeholder.com/300x200?text=Loading"
            />

            <div className="project-card-overlay">
                <button type="button" onClick={viewProject}>View</button>
            </div>
        </div>
    );
};

export default ProjectCard;
