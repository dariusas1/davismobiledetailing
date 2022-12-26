import './ReviewCard.css';
import Icon from '../Icon/Icon';

const ReviewCard = ({ name, review, number }) => {
    return (
        <div className="review-card">
            <p className="review-card-name">{name}</p>
            <div className="review-card-stars">
                {
                    [...Array(number)].map((a, i) => (
                        <Icon key={i} className={""} name={"star"} />
                    ))
                }
            </div>
            <p className="review-card-review">{review}</p>
        </div>
    )
};

export default ReviewCard;
