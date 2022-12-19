import './FaqCard.css';
import { useState } from 'react';

const FaqCard = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div
            className={"faq-list-item" + (isActive ? " active" : "")}
            onClick={() => isActive ? setIsActive(false) : setIsActive(true)}
        >
            <div className="faq-list-item-question">
                <p className="faq-question">What is ceramic coating?</p>
                <span className="faq-icon material-symbols-rounded">
                    expand_more
                        </span>
            </div>
            <p className="faq-answer">Ceramic coating is a chemical polymer solution that is applied to the
                exterior of
                a vehicle to protect it from external paint damage. Typically applied by hand, it blends
                with
                        the paint of your car and creates an additional hydrophobic layer of protection.</p>
        </div>
    )
};

export default FaqCard;
