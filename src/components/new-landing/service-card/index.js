import { h } from 'preact';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, downloadApp}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    
    return (
        <div style={cardStyle} class={style.serviceCard}>
            <div class={style.serviceName}>{serviceName}</div>
            <div class={style.serviceInfo}>
                <div class={style.description}>
                    The only way to learn a language is by having a real conversation. Telmie lets you practice your skills with a native speaker. Download the Telmie App and start speaking your new language right now.
                    {description}
                </div>
                <button class='red-btn' onClick={downloadApp}>Download app</button>
            </div>
        </div>
	)
}

export default ServiceCard;