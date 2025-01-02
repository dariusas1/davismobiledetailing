import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Initialize Swiper modules
const SwiperCore = { use: (modules) => {} };

// Swiper configuration for responsive image carousels
const swiperConfig = {
    modules: [Pagination, Navigation, Autoplay],
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: true,
    pagination: { 
        clickable: true 
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30
        }
    }
};

SwiperCore.use([Navigation, Pagination, Autoplay]);

export {
    Swiper,
    SwiperSlide,
    Pagination,
    Navigation,
    Autoplay
};

export default swiperConfig;
