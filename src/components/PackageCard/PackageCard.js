import "./PackageCard.css";
import Icon from "../Icon/Icon";
import { AppContext } from '../../App';
import { useContext } from 'react';

const PackageCard = ({ name, pricing, features }) => {
    const {
        setIsPkgModalActive,
        setPackagePlan,
        packagePlan
    } = useContext(AppContext);

    const choosePlan = () => {
        setIsPkgModalActive(true);
        setPackagePlan({ ...packagePlan, name: name });
    };

    return (
        <>
            <div className="package-card">
                <p className="package-card-heading">{name}</p>
                <div className={(pricing.length === 1 ? "package-card-price-list-one" : "package-card-price-list")}>
                    {
                        pricing.map((item, index) => (
                            <div key={index} className="package-card-price">
                                <p>{item.carType}</p>
                                <p>${item.price}</p>
                            </div>
                        ))
                    }
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
                <button type="button" onClick={choosePlan}>Choose Plan</button>
            </div>
        </>
    )
};

export default PackageCard;
