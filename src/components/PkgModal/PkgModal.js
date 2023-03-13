import './PkgModal.css';
import Icon from '../Icon/Icon';
import { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';

const PkgModal = ({ setIsActive, setPackagePlan, packagePlan }) => {
    const [modalForm, setModalForm] = useState({ serviceReq: packagePlan.name, name: "", phoneNum: "", error: "" });
    const [state, handleSubmit] = useForm(process.env.REACT_APP_PKG_MODAL_FORM_ID);

    useEffect(() => {
        if (state.succeeded) {
            setIsActive(false);
        } else if (state.errors.length > 0) {
            setModalForm({ ...modalForm, error: "There was a problem submitting." });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.succeeded, state.errors]);

    const closePkgModal = () => {
        setIsActive(false);
        setPackagePlan({ ...packagePlan, name: "" });
    };

    return (
        <div className="pkg-modal-overlay">
            <form className="pkg-modal" onSubmit={handleSubmit}>
                <span className="material-symbols-rounded pkg-modal-close" onClick={closePkgModal}>close</span>
                <label id="service-request-label" htmlFor="service-request-input">Your Service Request:</label>
                <input
                    id="service-request-input"
                    type="text"
                    name="service-request"
                    readOnly
                    placeholder={packagePlan.name}
                    defaultValue={packagePlan.name}
                />
                <ValidationError
                    prefix="service-request"
                    field="service-request"
                    errors={state.errors}
                />
                <div className="pkg-modal-inputs">
                    <div className="pkg-modal-input-group">
                        <label htmlFor="name-request-input">Name:</label>
                        <input
                            id="name-request-input"
                            type="text"
                            name="name"
                            required
                            onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                            value={modalForm.name}
                        />
                        <ValidationError
                            prefix="name"
                            field="name"
                            errors={state.errors}
                        />
                    </div>
                    <div className="pkg-modal-input-group">
                        <label htmlFor="phone-request-input">Phone Number:</label>
                        <input
                            id="phone-request-input"
                            type="tel"
                            name="phone-num"
                            required
                            onChange={(e) => setModalForm({ ...modalForm, phoneNum: e.target.value })}
                            value={modalForm.phoneNum}
                        />
                        <ValidationError
                            prefix="phone-num"
                            field="phone-num"
                            errors={state.errors}
                        />
                    </div>
                </div>
                <button className="modal-pkg-submit-btn" type="submit" disabled={state.submitting}>Send Request</button>
                {
                    modalForm.error && <p id="pkg-plan-modal-error">{modalForm.error}</p>
                }
                <div className="pkg-modal-contact-info">
                    <div className="pkg-modal-info-group">
                        <p className="pkg-modal-info-header">Text/Call at:</p>
                        <div>
                            <Icon className={""} name={"phone"} />
                            <p>(480)-285-9857</p>
                        </div>
                    </div>
                    <div className="pkg-modal-info-group">
                        <p className="pkg-modal-info-header">Email at:</p>
                        <div>
                            <Icon className={""} name={"mail"} />
                            <a href="mailto:davismobiledetailingaz@gmail.com">davismobiledetailingaz@gmail.com</a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PkgModal;