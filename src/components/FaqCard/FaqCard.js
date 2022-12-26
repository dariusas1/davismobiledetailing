import './FaqCard.css';
import { useState } from 'react';
import Icon from '../Icon/Icon';

const FaqCard = ({ question, answer }) => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div
            className={"faq-list-item" + (isActive ? " active" : "")}
            onClick={() => isActive ? setIsActive(false) : setIsActive(true)}
        >
            <div className="faq-list-item-question">
                <p className="faq-question">{question}</p>
                <Icon className={" faq-icon"} name={"expand_more"} />
            </div>
            <p className="faq-answer">{answer}</p>
        </div>
    )
};

export default FaqCard;
