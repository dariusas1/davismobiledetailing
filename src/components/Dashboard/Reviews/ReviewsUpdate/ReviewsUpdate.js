import './ReviewsUpdate.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const ReviewsUpdate = ({ cancelUpdateReviewBtnClicked }) => {
    const {
        updatedReview,
        setUpdatedReview,
        submitUpdatedReview,
        reviewWarning
    } = useContext(AppContext);
    return (
        <form className="reviews-update">
            <p className="review-update-heading">Update review</p>
            <input
                className="review-update-name-input"
                type="text"
                placeholder="Name"
                onChange={(e) => setUpdatedReview({ ...updatedReview, name: e.target.value })}
                value={updatedReview.name}
            />
            <textarea
                className="review-update-review-input"
                rows="4"
                placeholder="Review"
                onChange={(e) => setUpdatedReview({ ...updatedReview, review: e.target.value })}
                value={updatedReview.review}
            ></textarea>
            <div className="review-update-stars-dropdown">
                <div className="update-stars-dropdown-btn">Select Star Amount <span className="material-symbols-rounded">arrow_drop_down</span>
                </div>
                <ul className="stars-dropdown-items">
                    <li className="stars-dropdown-item" onClick={(e) => setUpdatedReview({ ...updatedReview, stars: 1 })}>1</li>
                    <li className="stars-dropdown-item" onClick={(e) => setUpdatedReview({ ...updatedReview, stars: 2 })}>2</li>
                    <li className="stars-dropdown-item" onClick={(e) => setUpdatedReview({ ...updatedReview, stars: 3 })}>3</li>
                    <li className="stars-dropdown-item" onClick={(e) => setUpdatedReview({ ...updatedReview, stars: 4 })}>4</li>
                    <li className="stars-dropdown-item" onClick={(e) => setUpdatedReview({ ...updatedReview, stars: 5 })}>5</li>
                </ul>
            </div>
            {
                updatedReview.stars > 0 && <div className="review-update-star-tag">{updatedReview.stars} stars</div>
            }
            <div className="review-update-btns">
                <button className="review-update-submit-btn" type="submit" onClick={submitUpdatedReview}>Update</button>
                <button className="review-update-cancel-btn" type="button" onClick={cancelUpdateReviewBtnClicked}>Cancel</button>
            </div>
            <p className="review-update-warning">{reviewWarning}</p>
        </form>
    )
};

export default ReviewsUpdate;
