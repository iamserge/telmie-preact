import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { setEmphasizedText } from '../../../utils/index'
import { langPack } from "../../../utils/langPack";
import { EN } from "../../../utils/consts";

const TextBlockMain = ({content, appLink = '', onDownloadApp, locale = EN}) => {
  const downloadApp = onDownloadApp ? onDownloadApp : () => appLink && window.open(appLink);

  return (
      <div class={`${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
            {setEmphasizedText(content, style.header)}
            {content.text ? <div class={style.text}>{content.text}</div> : null}
            <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
{/*
              <div class={style.buttons}>
                <Link href=""><button class='red-btn main-btn'>Sign up <span>free</span> <span>& Become Pro</span></button></Link>
                <button class='white-btn main-btn' onClick={downloadApp}>Download app</button>
              </div>
*/}
          </div>
          <div class={style.image}>
            <img src={content.img} alt={content.title} />
          </div>
      </div>
	)
};

export default TextBlockMain;