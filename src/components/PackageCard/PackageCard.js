import "./PackageCard.css";

const PackageCard = () => {
    return (
        <div className="package-card">
            <p className="package-card-heading">Basic Exterior</p>
            <div className="package-card-price-list">
                <div className="package-card-price">
                    <p>Sedans</p>
                    <p>$150</p>
                </div>
                <div className="package-card-price">
                    <p>Midsize</p>
                    <p>$160</p>
                </div>
                <div className="package-card-price">
                    <p>Truck</p>
                    <p>$175</p>
                </div>
                <div className="package-card-price">
                    <p>Van/3row</p>
                    <p>$190</p>
                </div>
            </div>
            <ul className="package-card-features">
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>2 bucket method exterior wash</p>
                </li>
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>Clean rims and tires</p>
                </li>
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>Tire shine</p>
                </li>
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>Spray wax</p>
                </li>
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>Full wipe down</p>
                </li>
                <li>
                    <span className="material-symbols-rounded">
                        check_circle
                            </span>
                    <p>Interior wipedown</p>
                </li>
            </ul>
            <button type="button">Choose Plan</button>
        </div>
    )
};

export default PackageCard;
