import './ReviewsView.css';
import { AppContext } from '../../../../App';
import { useContext, useEffect } from 'react';
import Icon from '../../../Icon/Icon';

const ReviewsView = ({ addReviewBtnClicked, updateReviewBtnClicked }) => {
    const {
        reviewsList,
        getReviewsList,
        deleteReview
    } = useContext(AppContext);

    useEffect(() => {
        getReviewsList();
    });

    return (
        <div className="reviews-view">
            <div className="add-review-card" onClick={addReviewBtnClicked}>
                <Icon className={""} name={"add"} />
            </div>
            {
                reviewsList.map(item => (
                    <div key={item.id} className="dashboard-review-card">
                        <p>{item.name}</p>
                        <p>{item.stars} stars</p>
                        <p>{item.review}</p>
                        <div className="review-card-options">
                            <span className="material-symbols-rounded" onClick={() => updateReviewBtnClicked(item.id, item.name, item.review, item.stars)}>edit</span>
                            <span className="material-symbols-rounded" onClick={() => deleteReview(item.id)}>delete</span>
                        </div>
                    </div>
                ))
            }

        </div>
    )
};

export default ReviewsView;