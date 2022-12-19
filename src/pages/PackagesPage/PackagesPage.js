import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Packages from '../../sections/Packages/Packages';
import ExtraInfo from '../../sections/ExtraInfo/ExtraInfo';
import Faqs from '../../sections/Faqs/Faqs';

const PackagesPage = () => {
    return (
        <>
            <Navbar Link={Link} />
            <Packages />
            <ExtraInfo />
            <Faqs />
            <Footer Link={Link} />
        </>
    )
};

export default PackagesPage;
