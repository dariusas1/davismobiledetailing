import './Sidebar.css';

const Sidebar = () => {
    return (
        <nav className="sidenav">
            <div className="sidenav-content">
                <div className="sidenav-icon">
                    <span className="material-symbols-rounded">
                        directions_car
                    </span>
                </div>
                <div className="sidenav-icon">
                    <span className="material-symbols-rounded">
                        request_quote
                    </span>
                </div>
                <div className="sidenav-icon">
                    <span className="material-symbols-rounded">
                        live_help
                    </span>
                </div>
                <div className="sidenav-icon">
                    <span className="material-symbols-rounded">
                        hotel_class
                    </span>
                </div>
                <div className="sidenav-icon">
                    <span className="material-symbols-rounded">
                        settings
                    </span>
                </div>
            </div>
        </nav>
    )
};

export default Sidebar;
