import './Hero.css';
import Icon from '../../components/Icon/Icon';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <p className="hero-title">Getting a Detail From Us</p>
                <div className="hero-items">
                    <div className="hero-item">
                        <Icon className={" hero-item-icon"} name={"calendar_month"} />
                        <p className="hero-item-bio">Choose a Detailing Plan and Fill Out Scheduling Request</p>
                    </div>
                    <div className="hero-item">
                        <Icon className={" hero-item-icon"} name={"mark_chat_read"} />
                        <p className="hero-item-bio">We Reach Out and Complete Scheduling</p>
                    </div>
                    <div className="hero-item">
                        <Icon className={" hero-item-icon"} name={"directions_car"} />
                        <p className="hero-item-bio">A Detailer Will Come to You and Professionally Detail Your Vehicle</p>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Hero;
