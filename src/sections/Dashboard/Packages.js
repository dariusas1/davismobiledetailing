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
        setEnteredUpdatedFeature,
        setEnteredPricing,
        setEnteredUpdatedPricing
    } = useContext(AppContext);

    const addPackageBtnClicked = () => {
        setPackagesIsAdding(true);
    }
    const cancelAddPackageBtnClicked = () => {
        setPackagesIsAdding(false);
        setPackageWarning("");
        setPackagePlan({ name: "", pricing: [], features: [] });
        setEnteredPricing({ carType: "", price: "" });
        setEnteredFeature({ feature: "", color: "" });
    }
    const updatePackageBtnClicked = (id, name, pricing, features) => {
        setPackagesIsUpdating(true);
        setUpdatedPackagePlan({
            id: id,
            name: name,
            pricing: pricing,
            features: features
        });
    }
    const cancelUpdatePackageBtnClicked = () => {
        setPackagesIsUpdating(false);
        setPackageWarning("");
        setUpdatedPackagePlan({ id: "", name: "", pricing: [], features: [] });
        setEnteredUpdatedPricing({ carType: "", price: "" });
        setEnteredUpdatedFeature({ feature: "", color: "" });
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
