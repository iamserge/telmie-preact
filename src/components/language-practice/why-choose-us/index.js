import { h } from 'preact';
import { Link } from 'preact-router';
import { langPack } from "../../../utils/langPack";
import style from './style.scss';

const WhyChooseUs = ({content = [], title, addClass, appLink = '', onDownloadApp, locale= 'en-us'}) => {
  const downloadApp = onDownloadApp ? onDownloadApp : () => appLink && window.open(appLink);

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
        <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
{/*
        <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
*/}
      </div>
    </div>
  )
};

export default WhyChooseUs;