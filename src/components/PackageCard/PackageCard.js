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
                            <Icon className={" package-card-features-icon-green"} name={"check_circle"} />
                            <p>{item}</p>
                        </li>
                    ))
                }
                {/* <li>
                    <Icon className={" package-card-features-icon-blue"} name={"verified_user"} />
                    <p>Interior wipedown</p>
                </li> */}
                {/* make carType & price arrays, then just say index[0,1,2,3,etc.] for both and render that. bc array1[2] will always === array2[2]*/}
            </ul>
            <button type="button">Choose Plan</button>
        </div>
    )
};

export default PackageCard;
