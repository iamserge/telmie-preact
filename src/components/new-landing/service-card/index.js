import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    
    return (
        <div style={cardStyle} class={style.serviceCard}>
          <Link href={link} class={style.serviceDescription}>
            <div class={style.serviceName}>{serviceName}</div>
            <div class={style.serviceInfo}>
               {description}
            </div>
            <button class='white-btn'>Start learning</button>
          </Link>
        </div>
	)
}

export default ServiceCard;