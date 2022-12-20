import './FaqsUpdate.css';
import { useContext } from 'react';
import { AppContext } from '../../../../App';

const FaqsUpdate = ({ cancelUpdateFaqBtnClicked }) => {
    const {
        updatedFaq,
        setUpdatedFaq,
        submitUpdatedFaq,
        faqWarning
    } = useContext(AppContext);
    return (
        <form className="faqs-update">
            <p className="faq-update-heading">Update your FAQ</p>
            <input
                className="faq-update-question-input"
                type="text"
                placeholder="Question"
                onChange={(e) => setUpdatedFaq({ ...updatedFaq, question: e.target.value })}
                value={updatedFaq.question}
            />
            <textarea
                className="faq-update-answer-input"
                rows="4"
                placeholder="Answer"
                onChange={(e) => setUpdatedFaq({ ...updatedFaq, answer: e.target.value })}
                value={updatedFaq.answer}
            ></textarea>
            <div className="faq-update-btns">
                <button className="faq-update-submit-btn" type="submit" onClick={submitUpdatedFaq}>Update</button>
                <button className="faq-update-cancel-btn" type="button" onClick={cancelUpdateFaqBtnClicked}>Cancel</button>
            </div>
            <p className="faq-update-warning">{faqWarning}</p>
        </form>
    )
};

export default FaqsUpdate;
