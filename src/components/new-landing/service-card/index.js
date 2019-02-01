import { h } from 'preact';
import { route } from 'preact-router';
import { AE } from "../../../utils/consts";
import style from './style.scss';

const ServiceCard = ({background, serviceName, description, link, linkLearn, earnBtnText, learnBtnText, locale}) => {
    const cardStyle = {background: `url('${background}') no-repeat center`, backgroundSize: "cover"};
    const btnClick = (_link) => () => route(_link);
    
    const cl = `${description && style.serviceCardAnimated} ${style.serviceCard} ${locale===AE && 'arabic-text'}`;
    
    return (

          <div style={cardStyle} class={cl}>
            <div class={style.serviceDescription}>
              <div class={style.serviceName}>{serviceName}</div>
              {description && <div class={style.serviceInfo}>
                 {description}
              </div>}
            </div>
            <div class={style.buttonArea}>
              { linkLearn && <button class={`white-btn ${style.whitebtn}`} onClick={btnClick(linkLearn)}>{learnBtnText}</button> }
              { link && <button class={`red-btn`} onClick={btnClick(link)}>{earnBtnText}</button> }
            </div>
          </div>
	)
}

export default ServiceCard;