import { h } from 'preact';
import { route } from 'preact-router';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    const learningClick = () => route(link);
    
    return (

          <div style={cardStyle} class={description ? `${style.serviceCard} ${style.serviceCardAnimated}`: style.serviceCard}>
            <div class={style.serviceDescription}>
              <div class={style.serviceName}>{serviceName}</div>
              {description && <div class={style.serviceInfo}>
                 {description}
              </div>}
            </div>
            <button class='white-btn' onClick={learningClick}>Start learning</button>
          </div>
	)
}

export default ServiceCard;