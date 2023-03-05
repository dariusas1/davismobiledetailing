import './Reviews.css';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';

const Reviews = () => {
    const {
        reviewsList,
        getReviewsList
    } = useContext(AppContext);

    useEffect(() => {
        getReviewsList();
    });

    return (
        <section className="reviews">
            <div className="reviews-heading">
                <p>REVIEWS</p>
                <p>Customer Feedback</p>
            </div>
            <div className={reviewsList.length > 0 ? "reviews-content" : "reviews-content-flex"}>
                {
                    reviewsList.length > 0
                        ?
                        reviewsList.map(item => (
                            <ReviewCard key={item.id} number={item.stars} name={item.name} review={item.review} />
                        ))
                        :
                        <p className="reviews-content-warning">Reviews coming soon, check back later.</p>
                }

            </div>
        </section>
    )
};

export default Reviews;
