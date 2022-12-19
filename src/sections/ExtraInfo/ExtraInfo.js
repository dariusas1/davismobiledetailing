import './ExtraInfo.css';
import xtraSideImg from '../../assets/images/whysidecar.jpg';

const ExtraInfo = () => {
    return (
        <section className="why-choose-us">
            <div className="why-choose-us-heading">
                <p>WHY CHOOSE US</p>
                <p>Why Would I Get My Vehicle Detailed?</p>
            </div>
            <div className="why-choose-us-content">
                <div className="why-choose-us-card">
                    <div className="why-choose-us-card-img">
                        <img src={xtraSideImg} alt="Blue Car" />
                    </div>
                    <div className="why-choose-us-card-text">
                        <p> It is important to note that a detail done by a professional has many benefits over a drive
                            through car wash. When a professional detailer from Davis Mobile Detailing services your
                            vehicle, they treat it as if it was their own, and strive for complete customer
                            satisfaction. Some of the reasons you should hire a professional detailer, over going to a
                            drive through car wash, are: the attention to detail a machine cannot replicate, the
                            knowledge on correcting and protecting your paint/interior for longevity, and consistently
                            high quality finished products.</p>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default ExtraInfo;