import { useContext } from 'react';
import ReviewsView from '../../components/Dashboard/Reviews/ReviewsView/ReviewsView';
import ReviewsAdd from '../../components/Dashboard/Reviews/ReviewsAdd/ReviewsAdd';
import ReviewsUpdate from '../../components/Dashboard/Reviews/ReviewsUpdate/ReviewsUpdate';
import { AppContext } from '../../App';

const Reviews = () => {
    const {
        setReview,
        reviewsIsAdding,
        setReviewsIsAdding,
        reviewsIsUpdating,
        setReviewsIsUpdating,
        setUpdatedReview,
        setReviewWarning
    } = useContext(AppContext);

    const addReviewBtnClicked = () => {
        setReviewsIsAdding(true);
    }
    const cancelAddReviewBtnClicked = () => {
        setReviewsIsAdding(false);
        setReviewWarning("");
        setReview({ name: "", review: "", stars: 0 });
    }

    const updateReviewBtnClicked = (id, name, review, stars) => {
        setReviewsIsUpdating(true);
        setUpdatedReview({
            id: id,
            name: name,
            review: review,
            stars: stars
        });
    }
    const cancelUpdateReviewBtnClicked = () => {
        setReviewsIsUpdating(false);
        setReviewWarning("");
        setUpdatedReview({ id: "", name: "", review: "", stars: 0 });
    }
    return (
        <>
            {
                !reviewsIsAdding && !reviewsIsUpdating
                &&
                <ReviewsView addReviewBtnClicked={addReviewBtnClicked} updateReviewBtnClicked={updateReviewBtnClicked} />
            }
            {
                reviewsIsAdding
                &&
                <ReviewsAdd cancelAddReviewBtnClicked={cancelAddReviewBtnClicked} />
            }
            {
                reviewsIsUpdating
                &&
                <ReviewsUpdate cancelUpdateReviewBtnClicked={cancelUpdateReviewBtnClicked} />
            }
        </>
    )
};

export default Reviews;
