import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Packages from '../../sections/Packages/Packages';
import ExtraInfo from '../../sections/ExtraInfo/ExtraInfo';
import Faqs from '../../sections/Faqs/Faqs';
import Navbar from '../../components/Navbar/Navbar';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import PkgModal from '../../components/PkgModal/PkgModal';

const PackagesPage = () => {
    const {
        isPkgModalActive,
        setIsPkgModalActive,
        packagePlan,
        setPackagePlan
    } = useContext(AppContext);

    useEffect(() => {
        if (isPkgModalActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isPkgModalActive]);

    return (
        <>
            <Navbar Link={Link} isHome={"no"} />
            <Packages />
            <ExtraInfo />
            <Faqs />
            <Footer Link={Link} />
            {
                isPkgModalActive 
                && 
                <PkgModal 
                setIsActive={setIsPkgModalActive} 
                packagePlan={packagePlan}
                setPackagePlan={setPackagePlan}
                />
            }
        </>
    )
};

export default PackagesPage;
