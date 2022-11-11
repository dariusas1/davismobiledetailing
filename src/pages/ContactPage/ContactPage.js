import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Contact from '../../sections/Contact/Contact';
import Footer from '../../components/Footer/Footer';

const ContactPage = () => {
    return (
        <>
            <Navbar Link={Link} />
            <Contact />
            <Footer Link={Link} />
        </>
    )
};

export default ContactPage;