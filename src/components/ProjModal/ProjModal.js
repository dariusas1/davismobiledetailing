import './ProjModal.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProjModal = ({ setIsActive, projectInfo, setProjectInfo }) => {

    const closeProjModal = () => {
        setIsActive(false);
        setProjectInfo({ title: "", imgs: [] });
    };

    return (
        <div className="proj-modal-overlay">
            <span className="material-symbols-rounded proj-modal-close" onClick={closeProjModal}>close</span>
            <div className="proj-modal">
                {
                    projectInfo.imgs.length === 1
                    &&
                    projectInfo.imgs.map((item, i) => (
                        <img className="proj-modal-img" key={i} src={item} alt={projectInfo.title} />
                    ))
                }
                {
                    projectInfo.imgs.length >= 2
                    &&
                    <Swiper
                        slidesPerView={1}
                        grabCursor={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                        speed={750}
                    >
                        {
                            projectInfo.imgs.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <img className="proj-modal-img" src={item} alt={projectInfo.title} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                }
            </div>
        </div>
    )
}

export default ProjModal;