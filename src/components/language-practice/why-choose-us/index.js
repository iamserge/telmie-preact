import { h } from 'preact';
import ReactGA from 'react-ga';
import { labelsGA } from "../../../utils/consts";
import style from './style.scss';

const WhyChooseUs = ({content = [], dBtn = {}, title, addClass}) => {
  const { btnText, btnLink } = dBtn;

  const downloadApp = () => ReactGA.outboundLink({
    label: labelsGA.downloadAppClick
  }, () => btnLink && window.location.assign(btnLink));

  return (
    <div class={addClass ?  `up-margin ${style.blockBg}` : style.blockBg}>
      <div class={style.blockBgInner}>
        <h2>{title.choose_us_title}</h2>

        <div class={style.steps}>
          {content.map(reason => (
              <div class={style.step} key={reason.id}>
                <div class={style.iconContainer}>
                  <img class={style.icon} src={reason.icon} alt={style.title} />
                </div>
                <div class={style.title}>{reason.title}</div>
                <div class={style.text}>{reason.text}</div>
              </div>
            ))}
        </div>
        { btnLink && btnText && 
          <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
{/*
        <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
*/}
      </div>
    </div>
  )
};

export default WhyChooseUs;