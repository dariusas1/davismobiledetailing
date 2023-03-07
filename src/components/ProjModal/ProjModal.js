import './ProjModal.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ProjModal = ({ setIsActive, projectInfo, setProjectInfo }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 750,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true
    };

    const closeProjModal = () => {
        setIsActive(false);
        setProjectInfo({ title: "", imgs: [] });
    };

    return (
        <div className="proj-modal-overlay">
            <span className="material-symbols-rounded proj-modal-close" onClick={closeProjModal}>close</span>
            <div className="proj-modal">
                <Slider {...settings}>
                    {projectInfo.imgs.map((item, i) => (
                        <img className="proj-modal-img" key={i} src={item} alt={projectInfo.title} />
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default ProjModal;