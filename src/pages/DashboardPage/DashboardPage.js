import './DashboardPage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Reviews from '../../sections/Dashboard/Reviews';
import Projects from '../../sections/Dashboard/Projects';
import Faqs from '../../sections/Dashboard/Faqs';
import Packages from '../../sections/Dashboard/Packages';
import { useState, useContext } from 'react';
import { AppContext } from '../../App';

const DashboardPage = () => {
    const [isProjectsSelected, setIsProjectsSelected] = useState(true);
    const [isPackagesSelected, setIsPackagesSelected] = useState(false);
    const [isFaqsSelected, setIsFaqsSelected] = useState(false);
    const [isReviewsSelected, setIsReviewsSelected] = useState(false);

    const projectsClicked = () => {
        setIsProjectsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
    }
    const packagesClicked = () => {
        setIsPackagesSelected(true);
        setIsReviewsSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
    }
    const faqsClicked = () => {
        setIsFaqsSelected(true);
        setIsPackagesSelected(false);
        setIsReviewsSelected(false);
        setIsProjectsSelected(false);
    }
    const reviewsClicked = () => {
        setIsReviewsSelected(true);
        setIsPackagesSelected(false);
        setIsFaqsSelected(false);
        setIsProjectsSelected(false);
    }

    const {
        logout
    } = useContext(AppContext);

    return (
        <div className="dashboard-container">
            <Sidebar
                projectsClicked={projectsClicked}
                packagesClicked={packagesClicked}
                faqsClicked={faqsClicked}
                reviewsClicked={reviewsClicked}
                isProjectsSelected={isProjectsSelected}
                isPackagesSelected={isPackagesSelected}
                isFaqsSelected={isFaqsSelected}
                isReviewsSelected={isReviewsSelected}
                logout={logout}
            />
            <section className="dashboard">
                <div className="dashboard-card">
                    {
                        isProjectsSelected
                        &&
                        <Projects />
                    }
                    {
                        isPackagesSelected
                        &&
                        <Packages />
                    }
                    {
                        isFaqsSelected
                        &&
                        <Faqs />
                    }
                    {
                        isReviewsSelected
                        &&
                        <Reviews />
                    }
                </div>
            </section>
        </div>
    )
};

export default DashboardPage;