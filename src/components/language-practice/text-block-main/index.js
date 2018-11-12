import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const TextBlockMain = ({textMain, appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.TextBlock} uk-container`}>
            <div class={style.howWorksText}>
                <h1 class={style.header}><span>{textMain[0].main}</span> {textMain[0].title}</h1>
                <div class={style.text}>{textMain[0].text}</div>
                <div class={style.buttons}>
                  <Link href=""><button class='red-btn main-btn'>Sign up <span>free</span> <span>& Become Pro</span></button></Link>
                  <button class='white-btn main-btn' onClick={downloadApp}>Download app</button>
                </div>
            </div>
            <div class={style.image}>
              <img src={textMain[0].img} alt={textMain[0].title}/>
            </div>
        </div> 
	)
};

export default TextBlockMain;