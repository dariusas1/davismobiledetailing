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
            <div className="review-card-review">
                <p>{review}</p>
            </div>
        </div>
    )
};

export default ReviewCard;
