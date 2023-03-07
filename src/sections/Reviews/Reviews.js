import './Reviews.css';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Reviews = () => {
    const {
        reviewsList,
        getReviewsList
    } = useContext(AppContext);

    useEffect(() => {
        getReviewsList();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: true
    };

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
                reviewsList.length > 1
                &&
                <div className="reviews-content">
                    <Slider {...settings}>
                        {
                            reviewsList.map(item => (
                                <ReviewCard key={item.id} number={item.stars} name={item.name} review={item.review} />
                            ))
                        }
                    </Slider>
                </div>
            }
        </section>
    )
};

export default Reviews;
