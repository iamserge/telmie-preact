import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    
    return (

          <Link href={link} style={cardStyle} class={description ? `${style.serviceCard} ${style.serviceCardAnimated}`: style.serviceCard}>
            <div class={style.serviceDescription}>
              <div class={style.serviceName}>{serviceName}</div>
              <div class={style.serviceInfo}>
                 {description}
              </div>

            </div>
            <button class='white-btn'>Start learning</button>
          </Link>
	)
}

export default ServiceCard;