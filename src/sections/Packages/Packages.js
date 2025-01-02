import './Packages.css';
import PackageCard from '../../components/PackageCard/PackageCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import { Swiper, SwiperSlide, Pagination, Navigation } from '../../utils/swiperConfig';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Button from '@mui/material/Button';

const Packages = () => {
    const {
        packagesList,
        getPackagesList
    } = useContext(AppContext);

    useEffect(() => {
        getPackagesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Default packages if none are loaded
    const defaultPackages = [
        {
            id: 1,
            name: 'Exterior Detail',
            pricing: '$150',
            features: [
                'Hand wash and dry',
                'Clay bar treatment',
                'Wax application',
                'Tire dressing'
            ]
        },
        {
            id: 2,
            name: 'Interior Detail',
            pricing: '$150',
            features: [
                'Vacuum and shampoo carpets',
                'Leather conditioning',
                'Dashboard cleaning',
                'Window cleaning'
            ]
        },
        {
            id: 3,
            name: 'Full Detail',
            pricing: '$250',
            features: [
                'Includes both exterior and interior services',
                'Engine bay cleaning',
                'Headlight restoration',
                'Odor elimination'
            ]
        },
        {
            id: 4,
            name: 'Ceramic Coating',
            pricing: '$500+',
            features: [
                'Paint surface preparation',
                'Professional-grade ceramic coating',
                'Long-lasting protection',
                'Enhanced gloss and shine'
            ]
        },
        {
            id: 5,
            name: 'Paint Correction',
            pricing: '$300+',
            features: [
                'Swirl mark removal',
                'Scratch reduction',
                'Paint polishing',
                'Surface refinement'
            ]
        }
    ];

    const displayPackages = packagesList.length > 0 ? packagesList : defaultPackages;

    return (
        <section className="packages" style={{ backgroundColor: '#000', padding: '50px 0' }}>
            <div className="packages-heading" style={{ color: '#FFD700' }}>
                <h2>OUR PACKAGES</h2>
                <p>Choose Your Plan</p>
            </div>
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
                    {displayPackages.map(item => (
                        <SwiperSlide key={item.id}>
                            <PackageCard
                                name={item.name}
                                pricing={item.pricing}
                                features={item.features}
                                action={
                                    <Button 
                                        variant="contained" 
                                        style={{ 
                                            backgroundColor: '#FFD700',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            marginTop: '20px'
                                        }}
                                        href="/booking"
                                    >
                                        Book Now
                                    </Button>
                                }
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
};

export default Packages;
