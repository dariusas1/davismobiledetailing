import './ProjModal.css';
import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const ProjModal = ({ setIsActive, imgs, title }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true
    };
    return (
        <div className="proj-modal-overlay">
            <span className="material-symbols-rounded proj-modal-close" onClick={() => setIsActive(false)}>close</span>
            <div className="proj-modal">
                <Slider {...settings}>
                    {imgs.map((item, i) => (
                        <img className="proj-modal-img" key={i} src={item} alt={title} />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default ProjModal;