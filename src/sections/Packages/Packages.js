import './Packages.css';
import PackageCard from '../../components/PackageCard/PackageCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';

const Packages = () => {
    const {
        packagesList,
        getPackagesList
    } = useContext(AppContext);

    useEffect(() => {
        getPackagesList();
    }, []);
    return (
        <section className="packages">
            <div className="packages-heading">
                <p>PACKAGES</p>
                <p>Choose Your Plan</p>
            </div>
            <div className="packages-content">
                {
                    packagesList.map(item => (
                        <PackageCard key={item.id} name={item.name} carType={item.carType} price={item.price} features={item.features} />
                    ))
                }
            </div>
        </section>
    )
};

export default Packages;
