import './Sidebar.css';

const Sidebar = ({ projectsClicked, packagesClicked, faqsClicked, reviewsClicked, isProjectsSelected, isPackagesSelected, isFaqsSelected, isReviewsSelected, logout }) => {
    return (
        <nav className="sidenav">
            <div className="sidenav-content">
                <div className={"sidenav-icon" + (isProjectsSelected ? " selected-white" : "")} onClick={projectsClicked}>
                    <span className={"material-symbols-rounded" + (isProjectsSelected ? " selected-blue" : "")}>
                        directions_car
                    </span>
                </div>
                <div className={"sidenav-icon" + (isPackagesSelected ? " selected-white" : "")} onClick={packagesClicked}>
                    <span className={"material-symbols-rounded" + (isPackagesSelected ? " selected-blue" : "")}>
                        request_quote
                    </span>
                </div>
                <div className={"sidenav-icon" + (isFaqsSelected ? " selected-white" : "")} onClick={faqsClicked}>
                    <span className={"material-symbols-rounded" + (isFaqsSelected ? " selected-blue" : "")}>
                        live_help
                    </span>
                </div>
                <div className={"sidenav-icon" + (isReviewsSelected ? " selected-white" : "")} onClick={reviewsClicked}>
                    <span className={"material-symbols-rounded" + (isReviewsSelected ? " selected-blue" : "")}>
                        hotel_class
                    </span>
                </div>
                <div className="sidenav-icon" onClick={logout}>
                    <span className="material-symbols-rounded">
                        settings
                    </span>
                </div>
            </div>
        </nav>
    )
};

export default Sidebar;