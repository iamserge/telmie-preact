import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { setEmphasizedText } from '../../../utils/index'

const TextBlockMain = ({content, appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);

  return (
      <div class={`${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
              <h1 class={style.header} dangerouslySetInnerHTML={setEmphasizedText(content)}>{content.title}</h1>
              {content.text ? <div class={style.text}>{content.text}</div> : null}
              <button class='red-btn' onClick={downloadApp}>Download app</button>
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