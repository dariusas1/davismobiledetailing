import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Projects from '../../sections/Projects/Projects';
import Banner from '../../sections/Banner/Banner';
import Reviews from '../../sections/Reviews/Reviews';
import Footer from '../../components/Footer/Footer';

const HomePage = () => {
    return (
        <>
            <Navbar Link={Link} />
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
