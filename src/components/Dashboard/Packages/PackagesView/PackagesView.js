import './PackagesView.css';
import { AppContext } from '../../../../App';
import { useContext, useEffect } from 'react';
import Icon from '../../../Icon/Icon';

const PackagesView = ({ addPackageBtnClicked, updatePackageBtnClicked }) => {
    const {
        packagesList,
        getPackagesList,
        deletePackage
    } = useContext(AppContext);
    useEffect(() => {
        getPackagesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="packages-view">
            <div className="add-package-card" onClick={addPackageBtnClicked}>
                <Icon className={""} name={"add"} />
            </div>
            {
                packagesList.map(item => (
                    <div key={item.id} className="dashboard-package-card">
                        <p>{item.name}</p>
                        <ul className="dashboard-package-card-prices">
                            {
                                item.pricing.map((item, index) => (
                                    <li key={index}>{item.carType} (${item.price})</li>
                                ))
                            }
                        </ul>
                        <ul className="dashboard-package-card-features">
                            {
                                item.features.map((item, index) => (
                                    <li className={"bullet-" + item.color} key={index}>{item.feature}</li>
                                ))
                            }
                        </ul>
                        <div className="dashboard-package-card-options">
                            <span className="material-symbols-rounded" onClick={() => updatePackageBtnClicked(item.id, item.name, item.pricing, item.features)}>edit</span>
                            <span className="material-symbols-rounded" onClick={() => deletePackage(item.id)}>delete</span>
                        </div>
                    </div>
                ))
            }

        </div>
    )
};

export default PackagesView;
