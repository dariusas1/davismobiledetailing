import React from 'react';
import Banner from '../../sections/Banner/Banner';
import About from '../../sections/About/About';
import Services from '../../sections/Services/Services';
import Gallery from '../../sections/Gallery/Gallery';
import Testimonials from '../../sections/Testimonials/Testimonials';
import Booking from '../../sections/Booking/Booking';
import Blog from '../../sections/Blog/Blog';
import Social from '../../sections/Social/Social';
import ServiceArea from '../../sections/ServiceArea/ServiceArea';
import CustomerPortal from '../../sections/CustomerPortal/CustomerPortal';
import ReferralProgram from '../../sections/ReferralProgram/ReferralProgram';
import PricingCalculator from '../../sections/PricingCalculator/PricingCalculator';

const Home = () => {
    return (
        <div className="home">
            <Banner />
            <About />
            <Services />
            <ServiceArea />
            <PricingCalculator />
            <Gallery />
            <Testimonials />
            <Booking />
            <ReferralProgram />
            <CustomerPortal />
            <Blog />
            <Social />
        </div>
    );
};

export default Home;
