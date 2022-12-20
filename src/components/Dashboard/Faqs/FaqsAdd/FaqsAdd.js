import './FaqsAdd.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const FaqsAdd = ({ cancelAddFaqBtnClicked }) => {
    const {
        faq,
        setFaq,
        faqWarning,
        handleFaqSubmit
    } = useContext(AppContext);
    return (
        <form className="faqs-add">
            <p className="faq-add-heading">Add a new FAQ</p>
            <input
                className="faq-add-question-input"
                type="text"
                placeholder="Question"
                onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                value={faq.question}
            />
            <textarea
                className="faq-add-answer-input"
                rows="4"
                placeholder="Answer"
                onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
                value={faq.answer}
            ></textarea>
            <div className="faq-add-btns">
                <button className="faq-add-submit-btn" type="submit" onClick={handleFaqSubmit}>Add</button>
                <button className="faq-add-cancel-btn" type="button" onClick={cancelAddFaqBtnClicked}>Cancel</button>
            </div>
            <p className="faq-add-warning">{faqWarning}</p>
        </form>
    )
};

export default FaqsAdd;
