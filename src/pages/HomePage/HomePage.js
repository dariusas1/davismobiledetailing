import { Link } from 'react-router-dom';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Projects from '../../sections/Projects/Projects';
import Banner from '../../sections/Banner/Banner';
import Reviews from '../../sections/Reviews/Reviews';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

const HomePage = () => {
    return (
        <>
            <Navbar Link={Link} isHome={"yes"} />
            <Hero />
            <About />
            <Projects />
            <Banner />
            <Reviews />
            <Footer Link={Link} />
        </>
    )
};

export default HomePage;
