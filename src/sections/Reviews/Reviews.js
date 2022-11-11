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
    }, []);

    return (
        <section className="reviews">
            <div className="reviews-heading">
                <p>REVIEWS</p>
                <p>Customer Feedback</p>
            </div>
            <div className="reviews-content">
                {
                    reviewsList.map(item => (
                        <ReviewCard key={item.id} number={item.stars} name={item.name} review={item.review} />
                    ))
                }

            </div>
        </section>
    )
};

export default Reviews;
