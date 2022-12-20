import './FaqCard.css';
import { useState } from 'react';

const FaqCard = ({ question, answer }) => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div
            className={"faq-list-item" + (isActive ? " active" : "")}
            onClick={() => isActive ? setIsActive(false) : setIsActive(true)}
        >
            <div className="faq-list-item-question">
                <p className="faq-question">{question}</p>
                <span className="faq-icon material-symbols-rounded">
                    expand_more
                        </span>
            </div>
            <p className="faq-answer">{answer}</p>
        </div>
    )
};

export default FaqCard;
