import { Link } from 'react-router-dom';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Projects from '../../sections/Projects/Projects';
import Banner from '../../sections/Banner/Banner';
import Reviews from '../../sections/Reviews/Reviews';
import Footer from '../../components/Footer/Footer';
import HomeNavbar from '../../components/HomeNavbar/HomeNavbar';
import ProjModal from '../../components/ProjModal/ProjModal';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';

const HomePage = () => {
    const {
        isProjModalActive,
        setIsProjModalActive,
        projectInfo,
        setProjectInfo,
    } = useContext(AppContext);

    useEffect(() => {
        if (isProjModalActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isProjModalActive]);

    return (
        <>
            <HomeNavbar Link={Link} />
            <Hero />
            <About />
            <Projects />
            <Banner />
            <Reviews />
            <Footer Link={Link} />
            {
                isProjModalActive
                &&
                <ProjModal
                    setIsActive={setIsProjModalActive}
                    projectInfo={projectInfo}
                    setProjectInfo={setProjectInfo}
                />
            }
        </>
    )
};

export default HomePage;