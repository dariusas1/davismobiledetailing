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
        removeSelectedUpdatedFeature
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
                    onChange={(e) => setUpdatedPackagePlan({ ...updatedPackagePlan, carType: e.target.value })}
                    value={updatedPackagePlan.carType}
                />
                <input
                    className="package-update-price-input"
                    type="text"
                    placeholder="Price(ex. 150)"
                    onChange={(e) => setUpdatedPackagePlan({ ...updatedPackagePlan, price: e.target.value })}
                    value={updatedPackagePlan.price}
                />
                {/* <button className="package-update-prices-input-btn" type="submit">+</button> */}
            </div>
            <div className="package-update-features">
                <input
                    className="package-update-feature-input"
                    type="text"
                    placeholder="Feature(ex. clay bar)"
                    onChange={(e) => setEnteredUpdatedFeature({ feature: e.target.value })}
                    value={enteredUpdatedFeature.feature}
                />
                <button className="package-update-features-input-btn" type="button" onClick={handleUpdatedFeature}>+</button>
            </div>
            <div className="updated-selected-features">
                {
                    updatedPackagePlan.features.map((item, i) => (
                        <div className="updated-feature-tag" key={i}>
                            <p>{item}</p>
                            <span className="material-symbols-rounded" data-feature={item} onClick={removeSelectedUpdatedFeature}>close</span>
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
