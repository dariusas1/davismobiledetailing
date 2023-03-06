import './FaqsView.css';
import { AppContext } from '../../../../App';
import { useContext, useEffect } from 'react';
import Icon from '../../../Icon/Icon';

const FaqsView = ({ addFaqBtnClicked, updateFaqBtnClicked }) => {
    const {
        faqsList,
        getFaqsList,
        deleteFaq
    } = useContext(AppContext);
    useEffect(() => {
        getFaqsList();
    }, []);
    return (
        <div className="faqs-view">
            <div className="add-faq-card" onClick={addFaqBtnClicked}>
                <Icon className={""} name={"add"} />
            </div>
            {
                faqsList.map(item => (
                    <div key={item.id} className="faq-card">
                        <p>{item.question}</p>
                        <p>{item.answer}</p>
                        <div className="faq-card-options">
                            <span className="material-symbols-rounded" onClick={() => updateFaqBtnClicked(item.id, item.question, item.answer)}>edit</span>
                            <span className="material-symbols-rounded" onClick={() => deleteFaq(item.id)}>delete</span>
                        </div>
                    </div>
                ))
            }

        </div>
    )
};

export default FaqsView;
