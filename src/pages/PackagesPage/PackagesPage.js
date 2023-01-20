import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Packages from '../../sections/Packages/Packages';
import ExtraInfo from '../../sections/ExtraInfo/ExtraInfo';
import Faqs from '../../sections/Faqs/Faqs';
import Navbar from '../../components/Navbar/Navbar';

const PackagesPage = () => {
    return (
        <>
            <Navbar Link={Link} isHome={"no"} />
            <Packages />
            <ExtraInfo />
            <Faqs />
            <Footer Link={Link} />
        </>
    )
};

export default PackagesPage;
