import { useContext } from 'react';
import FaqsView from '../../components/Dashboard/Faqs/FaqsView/FaqsView';
import FaqsAdd from '../../components/Dashboard/Faqs/FaqsAdd/FaqsAdd';
import FaqsUpdate from '../../components/Dashboard/Faqs/FaqsUpdate/FaqsUpdate';
import { AppContext } from '../../App';

const Faqs = () => {
    const {
        setFaq,
        setUpdatedFaq,
        faqsIsAdding,
        setFaqsIsAdding,
        faqsIsUpdating,
        setFaqsIsUpdating,
        setFaqWarning
    } = useContext(AppContext);

    const addFaqBtnClicked = () => {
        setFaqsIsAdding(true);
    }
    const cancelAddFaqBtnClicked = () => {
        setFaqsIsAdding(false);
        setFaqWarning("");
        setFaq({ question: "", answer: ""});
    }

    const updateFaqBtnClicked = (id, question, answer) => {
        setFaqsIsUpdating(true);
        setUpdatedFaq({
            id: id,
            question: question,
            answer: answer
        });
    }
    const cancelUpdateFaqBtnClicked = () => {
        setFaqsIsUpdating(false);
        setFaqWarning("");
        setUpdatedFaq({ id: "", question: "", answer: ""});
    }
    return (
        <>
            {
                !faqsIsAdding && !faqsIsUpdating
                &&
                <FaqsView addFaqBtnClicked={addFaqBtnClicked} updateFaqBtnClicked={updateFaqBtnClicked} />
            }
            {
                faqsIsAdding
                &&
                <FaqsAdd cancelAddFaqBtnClicked={cancelAddFaqBtnClicked} />
            }
            {
                faqsIsUpdating
                &&
                <FaqsUpdate cancelUpdateFaqBtnClicked={cancelUpdateFaqBtnClicked} />
            }
        </>
    )
};

export default Faqs;
