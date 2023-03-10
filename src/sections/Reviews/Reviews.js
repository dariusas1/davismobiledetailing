import './Reviews.css';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Reviews = () => {
    const {
        reviewsList,
        getReviewsList
    } = useContext(AppContext);

    useEffect(() => {
        getReviewsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="reviews">
            <div className="reviews-heading">
                <p>REVIEWS</p>
                <p>Customer Feedback</p>
            </div>
            {
                reviewsList.length === 0
                &&
                <div className="reviews-content-no-reviews">
                    <p className="reviews-content-warning">Reviews coming soon, check back later.</p>
                </div>
            }
            {
                reviewsList.length === 1
                &&
                <div className="reviews-content-one-review">
                    {reviewsList.map(item => (
                        <ReviewCard key={item.id} number={item.stars} name={item.name} review={item.review} />
                    ))}
                </div>
            }
            {
                reviewsList.length === 2
                &&
                <div className="reviews-content-two-reviews">
                    {reviewsList.map(item => (
                        <ReviewCard key={item.id} number={item.stars} name={item.name} review={item.review} />
                    ))}
                </div>
            }
            {
                reviewsList.length > 2
                &&
                <div className="reviews-content">
                    <Swiper
                        slidesPerView={2}
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
                            }
                        }}
                        speed={750}
                    >
                        {
                            reviewsList.map(item => (
                                <SwiperSlide key={item.id}>
                                    <ReviewCard number={item.stars} name={item.name} review={item.review} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            }
        </section>
    )
};

export default Reviews;
