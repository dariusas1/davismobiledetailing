import './Packages.css';
import PackageCard from '../../components/PackageCard/PackageCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Packages = () => {
    const {
        packagesList,
        getPackagesList
    } = useContext(AppContext);

    useEffect(() => {
        getPackagesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="packages">
            <div className="packages-heading">
                <p>PACKAGES</p>
                <p>Choose Your Plan</p>
            </div>
            {
                packagesList.length === 0
                &&
                <div className="packages-content-no-package">
                    <p className="packages-content-warning">Packages coming soon, check back later.</p>
                </div>
            }
            {
                packagesList.length === 1
                &&
                <div className="packages-content-one-package">
                    {
                        packagesList.map(item => (
                            <PackageCard
                                key={item.id}
                                name={item.name}
                                pricing={item.pricing}
                                features={item.features}
                            />
                        ))
                    }
                </div>
            }
            {
                packagesList.length === 2
                &&
                <div className="packages-content-two-packages">
                    {
                        packagesList.map(item => (
                            <PackageCard
                                key={item.id}
                                name={item.name}
                                pricing={item.pricing}
                                features={item.features}
                            />
                        ))
                    }
                </div>
            }
            {
                packagesList.length === 3
                &&
                <div className="packages-content-three-packages">
                    {
                        packagesList.map(item => (
                            <PackageCard
                                key={item.id}
                                name={item.name}
                                pricing={item.pricing}
                                features={item.features}
                            />
                        ))
                    }
                </div>
            }
            {
                packagesList.length > 3
                &&
                <div className="packages-content">
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={40}
                        grabCursor={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            900: {
                                slidesPerView: 2
                            },
                            1150: {
                                slidesPerView: 3
                            }
                        }}
                        speed={750}
                    >
                        {
                            packagesList.map(item => (
                                <SwiperSlide key={item.id}>
                                    <PackageCard
                                        name={item.name}
                                        pricing={item.pricing}
                                        features={item.features}
                                    />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            }
        </section>
    )
};

export default Packages;
