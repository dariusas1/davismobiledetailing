import './Contact.css';

const Contact = () => {
    return (
        <section className="contact">
            <div className="contact-heading">
                <p>CONTACT</p>
                <p>Got a Question?</p>
            </div>
            <div className="contact-card">
                <div className="contact-card-info">
                    <div className="contact-card-info-content">
                        <p className="contact-card-msg">We would love to hear from you! Please fill out this form and one of our mobile detailing
                            representatives will be in touch with you ASAP.</p>
                        <div className="contact-card-phone">
                            <span className="material-symbols-rounded">
                                phone
                            </span>
                            <p>(480)-285-9857</p>
                        </div>
                        <div className="contact-card-email">
                            <span className="material-symbols-rounded">
                                mail
                            </span>
                            <a href="mailto:davismobiledetailing@gmail.com">davismobiledetailing@gmail.com</a>
                        </div>
                    </div>
                </div>
                <form className="contact-form">
                    <input type="text" required placeholder="Name" />
                    <input type="text" required placeholder="Phone" />
                    <input type="email" required placeholder="Email" />
                    <textarea rows="4" required placeholder="Message"></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    )
};

export default Contact;
