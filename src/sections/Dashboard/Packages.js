import { useContext } from 'react';
import PackagesView from '../../components/Dashboard/Packages/PackagesView/PackagesView';
import PackagesAdd from '../../components/Dashboard/Packages/PackagesAdd/PackagesAdd';
import PackagesUpdate from '../../components/Dashboard/Packages/PackagesUpdate/PackagesUpdate';
import { AppContext } from '../../App';

const Packages = () => {
    const {
        setPackagePlan,
        setUpdatedPackagePlan,
        packagesIsAdding,
        setPackagesIsAdding,
        setEnteredFeature,
        packagesIsUpdating,
        setPackagesIsUpdating,
        setPackageWarning,
        setEnteredUpdatedFeature
    } = useContext(AppContext);

    const addPackageBtnClicked = () => {
        setPackagesIsAdding(true);
    }
    const cancelAddPackageBtnClicked = () => {
        setPackagesIsAdding(false);
        setPackageWarning("");
        setPackagePlan({ name: "", carType: "", price: "", features: [] });
        setEnteredFeature({ feature: "" });
    }
    const updatePackageBtnClicked = (id, name, carType, price, features) => {
        setPackagesIsUpdating(true);
        setUpdatedPackagePlan({
            id: id,
            name: name,
            carType: carType,
            price: price,
            features: features
        });
    }
    const cancelUpdatePackageBtnClicked = () => {
        setPackagesIsUpdating(false);
        setPackageWarning("");
        setUpdatedPackagePlan({ id: "", name: "", carType: "", price: "", features: [] });
        setEnteredUpdatedFeature({ feature: "" });
    }
    return (
        <>
            {
                !packagesIsAdding && !packagesIsUpdating
                &&
                <PackagesView addPackageBtnClicked={addPackageBtnClicked} updatePackageBtnClicked={updatePackageBtnClicked} />
            }
            {
                packagesIsAdding
                &&
                <PackagesAdd cancelAddPackageBtnClicked={cancelAddPackageBtnClicked} />
            }
            {
                packagesIsUpdating
                &&
                <PackagesUpdate cancelUpdatePackageBtnClicked={cancelUpdatePackageBtnClicked} />
            }
        </>
    )
};

export default Packages;
