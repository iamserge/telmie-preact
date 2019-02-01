import { h } from 'preact';
import { Link } from 'preact-router';
import ReactGA from 'react-ga';
import { setEmphasizedText } from '../../../utils/index'
import { labelsGA } from "../../../utils/consts";

import style from './style.scss';

const TextBlockMain = ({content, dBtn = {}}) => {
  const { btnText, btnLink } = dBtn;
  
  const downloadApp = () => ReactGA.outboundLink({
    label: labelsGA.downloadAppClick
  }, () => btnLink && window.location.assign(btnLink));

  return (
      <div class={`${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
            {setEmphasizedText(content, style.header)}
            {content.text ? <div class={style.text}>{content.text}</div> : null}
            { btnText && btnLink && 
              <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
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