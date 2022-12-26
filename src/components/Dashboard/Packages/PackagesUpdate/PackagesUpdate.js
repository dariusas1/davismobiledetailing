import './PackagesUpdate.css';

const PackagesUpdate = () => {
    return (
        <form className="packages-update">
            <p className="package-update-heading">Update package</p>
            <input className="package-update-name-input" type="text" placeholder="Name" />
            <div className="package-update-prices">
                <input className="package-update-type-input" type="text" placeholder="Car Type(ex. van)" />
                <input className="package-update-price-input" type="text" placeholder="Price(ex. 150)" />
                <button className="package-update-prices-input-btn" type="submit">+</button>
            </div>
            <div className="package-update-features">
                <input className="package-update-feature-input" type="text" placeholder="Feature(ex. clay bar)" />
                <button className="package-update-features-input-btn" type="submit">+</button>
            </div>
            <div className="package-update-btns">
                <button className="package-update-submit-btn" type="submit">Update</button>
                <button className="package-update-cancel-btn" type="button">Cancel</button>
            </div>
        </form>
    )
};

export default PackagesUpdate;
