import './ReviewsAdd.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const ReviewsAdd = ({ cancelAddReviewBtnClicked }) => {
    const {
        review,
        setReview,
        handleReviewSubmit,
        reviewWarning
    } = useContext(AppContext);
    return (
        <form className="reviews-add">
            <p className="review-add-heading">Add a new review</p>
            <input
                className="review-add-name-input"
                type="text"
                placeholder="Name"
                onChange={(e) => setReview({ ...review, name: e.target.value })}
                value={review.name}
            />
            <textarea
                className="review-add-review-input"
                rows="4"
                placeholder="Review"
                onChange={(e) => setReview({ ...review, review: e.target.value })}
                value={review.review}
            ></textarea>
            <div className="review-add-stars-dropdown">
                <div className="add-stars-dropdown-btn">Select Star Amount <span className="material-symbols-rounded">arrow_drop_down</span>
                </div>
                <ul className="stars-dropdown-items">
                    <li className="stars-dropdown-item" onClick={(e) => setReview({ ...review, stars: 1 })}>1</li>
                    <li className="stars-dropdown-item" onClick={(e) => setReview({ ...review, stars: 2 })}>2</li>
                    <li className="stars-dropdown-item" onClick={(e) => setReview({ ...review, stars: 3 })}>3</li>
                    <li className="stars-dropdown-item" onClick={(e) => setReview({ ...review, stars: 4 })}>4</li>
                    <li className="stars-dropdown-item" onClick={(e) => setReview({ ...review, stars: 5 })}>5</li>
                </ul>
            </div>
            {
                review.stars > 0 && <div className="review-add-star-tag">{review.stars} stars</div>
            }
            <div className="review-add-btns">
                <button className="review-add-submit-btn" type="submit" onClick={handleReviewSubmit}>Add</button>
                <button className="review-add-cancel-btn" type="button" onClick={cancelAddReviewBtnClicked}>Cancel</button>
            </div>
            <p className="review-add-warning">{reviewWarning}</p>
        </form>
    )
};

export default ReviewsAdd;
