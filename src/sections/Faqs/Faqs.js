import './Faqs.css';
import FaqCard from '../../components/FaqCard/FaqCard';

const Faqs = () => {
    return (
        <section className="faq">
            <div className="faq-heading">
                <p>LETS HELP</p>
                <p>Frequently Asked Questions</p>
            </div>
            <div className="faq-content">
                <FaqCard />
            </div>
        </section>
    )
};

export default Faqs;
