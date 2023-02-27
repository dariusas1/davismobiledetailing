import './Contact.css';
import Icon from '../../components/Icon/Icon';
import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
    const [state, handleSubmit] = useForm("xayzjynj");
    const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", msg: "", success: "", error: "" });
    useEffect(() => {
        if (state.succeeded) {
            setContactForm({
                name: "",
                phone: "",
                email: "",
                msg: "",
                success: "Form submitted successfully!",
                error: ""
            });
        } else if (state.errors.length > 0) {
            setContactForm({ ...contactForm, success: "", error: "There was a problem submitting." });
        }
    }, [state.succeeded, state.errors]);

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
                            <Icon className={""} name={"phone"} />
                            <p>(480)-285-9857</p>
                        </div>
                        <div className="contact-card-email">
                            <Icon className={""} name={"mail"} />
                            <a href="mailto:davismobiledetailingaz@gmail.com">davismobiledetailingaz@gmail.com</a>
                        </div>
                    </div>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        required
                        placeholder="Name"
                        name="name"
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        value={contactForm.name}
                    />
                    <ValidationError
                        prefix="name"
                        field="name"
                        errors={state.errors}
                    />
                    <input
                        type="text"
                        required
                        placeholder="Phone"
                        name="phone"
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        value={contactForm.phone}
                    />
                    <ValidationError
                        prefix="phone"
                        field="phone"
                        errors={state.errors}
                    />
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        name="email"
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        value={contactForm.email}
                    />
                    <ValidationError
                        prefix="email"
                        field="email"
                        errors={state.errors}
                    />
                    <textarea
                        rows="4"
                        required
                        placeholder="Message"
                        name="message"
                        onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                        value={contactForm.msg}
                    ></textarea>
                    <ValidationError
                        prefix="message"
                        field="message"
                        errors={state.errors}
                    />
                    <button type="submit">Submit</button>
                    {
                        contactForm.success && <p id="contact-form-success-msg">{contactForm.success}</p>
                    }
                    {
                        contactForm.error && <p id="contact-form-error-msg">{contactForm.error}</p>
                    }
                </form>
            </div>
        </section>
    )
};

export default Contact;
