import './Projects.css';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
            {
                projectsList.length === 0
                &&
                <div className="projects-content-no-project">
                    <p className="projects-content-warning">Projects coming soon, check back later.</p>
                </div>
            }
            {
                projectsList.length === 1
                &&
                <div className="projects-content-one-project">
                    {
                        projectsList.map((item, i) => (
                            <ProjectCard key={i} title={item.title} imgs={item.imgs} />
                        ))
                    }
                </div>
            }
            {
                projectsList.length === 2
                &&
                <div className="projects-content-two-projects">
                    {
                        projectsList.map((item, i) => (
                            <ProjectCard key={i} title={item.title} imgs={item.imgs} />
                        ))
                    }
                </div>
            }
            {
                projectsList.length === 3
                &&
                <div className="projects-content-three-projects">
                    {
                        projectsList.map((item, i) => (
                            <ProjectCard key={i} title={item.title} imgs={item.imgs} />
                        ))
                    }
                </div>
            }
            {
                projectsList.length > 3
                &&
                <div className="projects-content">
                    <Swiper
                        slidesPerView={3}
                        grabCursor={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            700: {
                                slidesPerView: 2
                            },
                            1000: {
                                slidesPerView: 3
                            }
                        }}
                        speed={750}
                    >
                        {
                            projectsList.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <ProjectCard title={item.title} imgs={item.imgs} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            }
        </section>
    )
};

export default Projects;