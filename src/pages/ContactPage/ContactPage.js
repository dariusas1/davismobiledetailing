import { Link } from 'react-router-dom';
import Contact from '../../sections/Contact/Contact';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

const ContactPage = () => {
    return (
        <>
            <Navbar Link={Link} isHome={"no"} />
            <Contact />
            <Footer Link={Link} />
        </>
    )
};

export default ContactPage;