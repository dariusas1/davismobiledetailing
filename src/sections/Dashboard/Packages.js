import { useContext } from 'react';
import PackagesView from '../../components/Dashboard/Packages/PackagesView/PackagesView';
import PackagesAdd from '../../components/Dashboard/Packages/PackagesAdd/PackagesAdd';
import PackagesUpdate from '../../components/Dashboard/Packages/PackagesUpdate/PackagesUpdate';
import { AppContext } from '../../App';

const Packages = () => {
    const {
        setPackagePlan,
        // setUpdatedPackage,
        packagesIsAdding,
        setPackagesIsAdding,
        setEnteredFeature,
        // packagesIsUpdating,
        // setPackagesIsUpdating,
        setPackageWarning
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
    // const updatePackageBtnClicked = (id, question, answer) => {
    //     setPackagesIsUpdating(true);
    //     setUpdatedPackage({
    //         id: id,
    //         question: question,
    //         answer: answer
    //     });
    // }
    // const cancelUpdatePackageBtnClicked = () => {
    //     setPackagesIsUpdating(false);
    //     setPackageWarning("");
    //     setUpdatedPackage({ id: "", question: "", answer: "" });
    // }
    return (
        <>
            {
                // !packagesIsAdding && !packagesIsUpdating
                !packagesIsAdding
                &&
                // <PackagesView addPackageBtnClicked={addPackageBtnClicked} updatePackageBtnClicked={updatePackageBtnClicked} />
                <PackagesView addPackageBtnClicked={addPackageBtnClicked} />
            }
            {
                packagesIsAdding
                &&
                <PackagesAdd cancelAddPackageBtnClicked={cancelAddPackageBtnClicked} />
            }
            {/* {
                packagesIsUpdating
                &&
                <PackagesUpdate cancelUpdatePackageBtnClicked={cancelUpdatePackageBtnClicked} />
            } */}
        </>
    )
};

export default Packages;
