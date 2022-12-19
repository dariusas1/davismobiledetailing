import './Packages.css';
import PackageCard from '../../components/PackageCard/PackageCard';

const Packages = () => {
    return (
        <section className="packages">
            <div className="packages-heading">
                <p>PACKAGES</p>
                <p>Choose Your Plan</p>
            </div>
            <div className="packages-content">

                <PackageCard />

            </div>
        </section>
    )
};

export default Packages;
