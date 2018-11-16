import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    
    return (

          <Link href={link} style={cardStyle} class={style.serviceCard}>
            <div class={style.serviceDescription}>
              <div class={style.serviceName}>{serviceName}</div>
              <div class={style.serviceInfo}>
                 {description}
              </div>
              <button class='white-btn'>Start learning</button>
            </div>
          </Link>
	)
}

export default ServiceCard;