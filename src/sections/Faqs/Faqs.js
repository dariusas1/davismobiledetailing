import './Faqs.css';
import FaqCard from '../../components/FaqCard/FaqCard';
import { AppContext } from '../../App';
import { useContext, useEffect } from 'react';

const Faqs = () => {
    const {
        faqsList,
        getFaqsList
    } = useContext(AppContext);

    useEffect(() => {
        getFaqsList();
    }, []);

    return (
        <section className="faq">
            <div className="faq-heading">
                <p>LETS HELP</p>
                <p>Frequently Asked Questions</p>
            </div>
            <div className="faq-content">
                {
                    faqsList.map(item => (
                        <FaqCard key={item.id} question={item.question} answer={item.answer} />
                    ))
                }
            </div>
        </section>
    )
};

export default Faqs;
