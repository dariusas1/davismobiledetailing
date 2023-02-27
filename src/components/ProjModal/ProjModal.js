import './ProjModal.css';
import { useState, useEffect } from 'react';


const ProjModal = ({ setIsActive, title }) => {
    // set active state in projcardcompentn same as pkg card
    // const [modalForm, setModalForm] = useState({ serviceReq: serviceReq, name: "", phoneNum: "", error: "" });

    return (
        <div className="proj-modal-overlay">
            <div className="proj-modal">
                <span className="material-symbols-rounded proj-modal-close" onClick={() => setIsActive(false)}>close</span>
                <h1>{title}</h1>
            </div>
        </div>
    )
}

export default ProjModal;