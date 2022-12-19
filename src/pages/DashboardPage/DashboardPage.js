import './DashboardPage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Reviews from '../../sections/Dashboard/Reviews';
import Projects from '../../sections/Dashboard/Projects';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <section className="dashboard">
                <div className="dashboard-card">
                    <Reviews />
                    {/* <Projects /> */}
                </div>
            </section>
        </div>
    )
};

export default DashboardPage;
