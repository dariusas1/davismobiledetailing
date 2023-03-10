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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="faq">
            <div className="faq-heading">
                <p>LETS HELP</p>
                <p>Frequently Asked Questions</p>
            </div>
            <div className={faqsList.length > 0 ? "faq-content" : "faq-content-flex"}>
                {
                    faqsList.length > 0
                        ?
                        faqsList.map(item => (
                            <FaqCard key={item.id} question={item.question} answer={item.answer} />
                        ))
                        :
                        <p className="faq-content-warning">FAQs coming soon, check back later.</p>
                }
            </div>
        </section>
    )
};

export default Faqs;
