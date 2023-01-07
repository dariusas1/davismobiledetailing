import "./PackageCard.css";
import Icon from "../Icon/Icon";

const PackageCard = ({ name, carType, price, features }) => {
    return (
        <div className="package-card">
            <p className="package-card-heading">{name}</p>
            <div className="package-card-price-list">
                <div className="package-card-price">
                    <p>{carType}</p>
                    <p>${price}</p>
                </div>
            </div>
            <ul className="package-card-features">
                {
                    features.map((item, index) => (
                        <li key={index}>
                            {
                                item.color === "green"
                                    ?
                                    <Icon className={" package-card-features-icon-green"} name={"check_circle"} />
                                    :
                                    <Icon className={" package-card-features-icon-blue"} name={"verified_user"} />
                            }
                            <p>{item.feature}</p>
                        </li>
                    ))
                }
            </ul>
            <button type="button">Choose Plan</button>
        </div>
    )
};

export default PackageCard;
