import './ProjModal.css';
import { useState } from 'react';


const ProjModal = ({ setIsActive, imgs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevPic = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? imgs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextPic = () => {
        const isLastSlide = currentIndex === imgs.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="proj-modal-overlay">
            <span className="material-symbols-rounded proj-modal-close" onClick={() => setIsActive(false)}>close</span>
            <div className="proj-modal">
                <span className="material-symbols-rounded proj-modal-prevArr" onClick={prevPic}>arrow_back_ios_new</span>
                <span className="material-symbols-rounded proj-modal-nextArr" onClick={nextPic}>arrow_forward_ios</span>
                <div className="proj-modal-slider" style={{ backgroundImage: `url(${imgs[currentIndex]})` }}></div>
            </div>
        </div>
    )
}

export default ProjModal;