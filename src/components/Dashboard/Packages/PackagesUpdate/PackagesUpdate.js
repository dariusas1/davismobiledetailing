import './PackagesUpdate.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const PackagesUpdate = ({ cancelUpdatePackageBtnClicked }) => {
    const {
        updatedPackagePlan,
        setUpdatedPackagePlan,
        submitUpdatedPackage,
        packageWarning,
        setEnteredUpdatedFeature,
        enteredUpdatedFeature,
        handleUpdatedFeature,
        removeSelectedUpdatedFeature,
        setEnteredUpdatedPricing,
        enteredUpdatedPricing,
        handleUpdatedPricing,
        removeSelectedUpdatedPricing
    } = useContext(AppContext);
    return (
        <form className="packages-update">
            <p className="package-update-heading">Update package</p>
            <input
                className="package-update-name-input"
                type="text"
                placeholder="Name"
                onChange={(e) => setUpdatedPackagePlan({ ...updatedPackagePlan, name: e.target.value })}
                value={updatedPackagePlan.name}
            />
            <div className="package-update-prices">
                <input
                    className="package-update-type-input"
                    type="text"
                    placeholder="Car Type(ex. van)"
                    onChange={(e) => setEnteredUpdatedPricing({ ...enteredUpdatedPricing, carType: e.target.value })}
                    value={enteredUpdatedPricing.carType}
                />
                <input
                    className="package-update-price-input"
                    type="text"
                    placeholder="Price(ex. 150)"
                    onChange={(e) => setEnteredUpdatedPricing({ ...enteredUpdatedPricing, price: e.target.value })}
                    value={enteredUpdatedPricing.price}
                />
                <button className="package-update-prices-input-btn" type="button" onClick={handleUpdatedPricing}>+</button>
            </div>
            <div className="selected-updated-pricings">
                {
                    updatedPackagePlan.pricing.map((item, i) => (
                        <div className="updated-pricing-tag" key={i}>
                            <p>{item.carType} (${item.price})</p>
                            <span className="material-symbols-rounded" data-cartype={item.carType} onClick={removeSelectedUpdatedPricing}>close</span>
                        </div>
                    ))
                }
            </div>
            <div className="package-update-features">
                <input
                    className="package-update-feature-input"
                    type="text"
                    placeholder="Feature(ex. clay bar)"
                    onChange={(e) => setEnteredUpdatedFeature({ ...enteredUpdatedFeature, feature: e.target.value })}
                    value={enteredUpdatedFeature.feature}
                />
                <div className="package-update-feature-dropdown">
                    <div className="update-feature-dropdown-btn">Select Color <span className="material-symbols-rounded">arrow_drop_down</span>
                    </div>
                    <ul className="update-feature-dropdown-items">
                        <li className="update-feature-dropdown-item" onClick={() => setEnteredUpdatedFeature({ ...enteredUpdatedFeature, color: "green" })}>Green</li>
                        <li className="update-feature-dropdown-item" onClick={() => setEnteredUpdatedFeature({ ...enteredUpdatedFeature, color: "blue" })}>Blue</li>
                    </ul>
                </div>
                <button className="package-update-features-input-btn" type="button" onClick={handleUpdatedFeature}>+</button>
            </div>
            <div className="updated-selected-features">
                {
                    updatedPackagePlan.features.map((item, i) => (
                        <div className={"updated-feature-tag " + item.color} key={i}>
                            <p>{item.feature}</p>
                            <span className="material-symbols-rounded" data-feature={item.feature} onClick={removeSelectedUpdatedFeature}>close</span>
                        </div>
                    ))
                }
            </div>
            <div className="package-update-btns">
                <button className="package-update-submit-btn" type="submit" onClick={submitUpdatedPackage}>Update</button>
                <button className="package-update-cancel-btn" type="button" onClick={cancelUpdatePackageBtnClicked}>Cancel</button>
            </div>
            <p className="package-update-warning">{packageWarning}</p>
        </form>
    )
};

export default PackagesUpdate;
