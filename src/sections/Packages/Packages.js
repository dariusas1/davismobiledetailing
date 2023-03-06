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
            <div className={packagesList.length > 0 ? "packages-content" : "packages-content-flex"}>
                {
                    packagesList.length > 0
                        ?
                        packagesList.map(item => (
                            <PackageCard
                                key={item.id}
                                name={item.name}
                                pricing={item.pricing}
                                features={item.features}
                            />
                        ))
                        :
                        <p className="packages-content-warning">Packages coming soon, check back later.</p>
                }
            </div>
        </section>
    )
};

export default Packages;
