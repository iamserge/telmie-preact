import { h } from 'preact';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, downloadApp}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    
    return (
        <div style={cardStyle} class={style.serviceCard}>
          <div>
            <div class={style.serviceName}>{serviceName}</div>
            <div class={style.serviceInfo}>
                <div class={style.description}>
                    {description}
                </div>
                <button class='red-btn' onClick={downloadApp}>Download app</button>
            </div>
          </div>
        </div>
	)
}

export default ServiceCard;