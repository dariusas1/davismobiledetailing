import './PackagesAdd.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const PackagesAdd = ({ cancelAddPackageBtnClicked }) => {
    const {
        packagePlan,
        setPackagePlan,
        packageWarning,
        handlePackageSubmit,
        handleFeature,
        enteredFeature,
        setEnteredFeature,
        removeSelectedFeature,
        enteredPricing,
        setEnteredPricing,
        handlePricing,
        removeSelectedPricing
    } = useContext(AppContext);
    return (
        <form className="packages-add">
            <p className="package-add-heading">Add a new package</p>
            <input
                className="package-add-name-input"
                type="text"
                placeholder="Name"
                onChange={(e) => setPackagePlan({ ...packagePlan, name: e.target.value })}
                value={packagePlan.name}
            />
            <div className="package-add-prices">
                <input
                    className="package-add-type-input"
                    type="text"
                    placeholder="Car Type(ex. van)"
                    onChange={(e) => setEnteredPricing({ ...enteredPricing, carType: e.target.value })}
                    value={enteredPricing.carType}
                />
                <input
                    className="package-add-price-input"
                    type="text"
                    placeholder="Price(ex. 150)"
                    onChange={(e) => setEnteredPricing({ ...enteredPricing, price: e.target.value })}
                    value={enteredPricing.price}
                />
                <button className="package-add-prices-input-btn" type="button" onClick={handlePricing}>+</button>
            </div>
            <div className="selected-pricings">
                {
                    packagePlan.pricing.map((item, i) => (
                        <div className="add-pricing-tag" key={i}>
                            <p>{item.carType} (${item.price})</p>
                            <span className="material-symbols-rounded" data-cartype={item.carType} onClick={removeSelectedPricing}>close</span>
                        </div>
                    ))
                }
            </div>
            <div className="package-add-features">
                <input
                    className="package-add-feature-input"
                    type="text"
                    placeholder="Feature(ex. clay bar)"
                    onChange={(e) => setEnteredFeature({ ...enteredFeature, feature: e.target.value })}
                    value={enteredFeature.feature}
                />
                <div className="package-add-feature-dropdown">
                    <div className="add-feature-dropdown-btn">Select Color <span className="material-symbols-rounded">arrow_drop_down</span>
                    </div>
                    <ul className="feature-dropdown-items">
                        <li className="feature-dropdown-item" onClick={() => setEnteredFeature({ ...enteredFeature, color: "green" })}>Green</li>
                        <li className="feature-dropdown-item" onClick={() => setEnteredFeature({ ...enteredFeature, color: "blue" })}>Blue</li>
                    </ul>
                </div>
                <button className="package-add-features-input-btn" type="button" onClick={handleFeature}>+</button>
            </div>
            <div className="selected-features">
                {
                    packagePlan.features.map((item, i) => (
                        <div className={"add-feature-tag " + item.color} key={i}>
                            <p>{item.feature}</p>
                            <span className="material-symbols-rounded" data-feature={item.feature} onClick={removeSelectedFeature}>close</span>
                        </div>
                    ))
                }
            </div>
            <div className="package-add-btns">
                <button className="package-add-submit-btn" type="submit" onClick={handlePackageSubmit}>Add</button>
                <button className="package-add-cancel-btn" type="button" onClick={cancelAddPackageBtnClicked}>Cancel</button>
            </div>
            <p className="package-add-warning">{packageWarning}</p>
        </form>
    )
};

export default PackagesAdd;
