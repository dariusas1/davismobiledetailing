import './ReviewCard.css';

const ReviewCard = ({ name, review, number }) => {
    return (
        <div className="review-card">
            <p className="review-card-name">{name}</p>
            <div className="review-card-stars">
                {
                    [...Array(number)].map((a, i) => (
                        <span key={i} className="material-symbols-rounded">star</span>
                    ))
                }
            </div>
            <p className="review-card-review">{review}</p>
        </div>
    )
};

export default ReviewCard;
