import './DashboardPage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Reviews from '../../sections/Dashboard/Reviews';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <section className="dashboard">
                <div className="dashboard-card">
                    <Reviews />
                </div>
            </section>
        </div>
    )
};

export default DashboardPage;
