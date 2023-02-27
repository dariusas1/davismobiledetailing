import "./PackageCard.css";
import Icon from "../Icon/Icon";
import PkgModal from "../PkgModal/PkgModal";
import { useState, useEffect } from 'react';

const PackageCard = ({ name, pricing, features }) => {
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isActive]);
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
                <button type="button" onClick={() => setIsActive(true)}>Choose Plan</button>
            </div>
            {
                isActive && <PkgModal serviceReq={name} setIsActive={setIsActive} />
            }
        </>
    )
};

export default PackageCard;
