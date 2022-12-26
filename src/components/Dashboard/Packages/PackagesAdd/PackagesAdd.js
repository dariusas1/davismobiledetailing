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
        // grab
        removeSelectedFeature
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
                    onChange={(e) => setPackagePlan({ ...packagePlan, carType: e.target.value })}
                    value={packagePlan.carType}
                />
                <input
                    className="package-add-price-input"
                    type="text"
                    placeholder="Price(ex. 150)"
                    onChange={(e) => setPackagePlan({ ...packagePlan, price: e.target.value })}
                    value={packagePlan.price}
                />
                {/* <button className="package-add-prices-input-btn" type="button">+</button> */}
            </div>
            <div className="package-add-features">
                <input
                    className="package-add-feature-input"
                    type="text"
                    placeholder="Feature(ex. clay bar)"
                    onChange={(e) => setEnteredFeature({ feature: e.target.value })}
                    value={enteredFeature.feature}
                />
                <button className="package-add-features-input-btn" type="button" onClick={handleFeature}>+</button>
            </div>
            <div className="selected-features">
                {
                    packagePlan.features.map((item, i) => (
                        <div className="feature-test" key={i}>
                            <p>{item}</p>
                            <span className="material-symbols-rounded" data-feature={item} onClick={removeSelectedFeature}>close</span>
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
