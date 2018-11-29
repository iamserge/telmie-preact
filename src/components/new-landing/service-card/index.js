import { h } from 'preact';
import { route } from 'preact-router';
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link, linkLearn}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    const btnClick = (_link) => () => route(_link);
    
    return (

          <div style={cardStyle} class={description ? `${style.serviceCard} ${style.serviceCardAnimated}`: style.serviceCard}>
            <div class={style.serviceDescription}>
              <div class={style.serviceName}>{serviceName}</div>
              {description && <div class={style.serviceInfo}>
                 {description}
              </div>}
            </div>
            <div class={style.buttonArea}>
              { linkLearn && <button class={`red-btn`} onClick={btnClick(linkLearn)}>Start learning</button> }
              { link && <button class={`white-btn ${style.whitebtn}`} onClick={btnClick(link)}>Start earning</button> }
            </div>
          </div>
	)
}

export default ServiceCard;