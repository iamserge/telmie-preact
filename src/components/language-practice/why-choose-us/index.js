import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const WhyChooseUs = ({content = [], title, addClass, appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);

  return (
    <div class={addClass ?  `up-margin ${style.blockBg}` : style.blockBg}>
      <div class={style.blockBgInner}>
        <h2>{title.choose_us_title}</h2>

        <div class={style.steps}>
          {content.map(reason => (
              <div class={style.step} key={reason.id}>
                <img class={style.icon} src={reason.icon} alt={style.title} />
                <div class={style.title}>{reason.title}</div>
                <div class={style.text}>{reason.text}</div>
              </div>
            ))}
        </div>
        <button class='red-btn' onClick={downloadApp}>Download app</button>
{/*
        <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
*/}
      </div>
    </div>
  )
};

export default WhyChooseUs;