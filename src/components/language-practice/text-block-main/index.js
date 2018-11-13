import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const TextBlockMain = ({content, appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);
       let header;
       let headerTag = document.getElementsByClassName('header');

  if(content.title.indexOf(content.emphasized) + 1) {
    header = content.title.replace(content.emphasized, `<span>${content.emphasized}</span>`);
    let headerTag = document.getElementsByClassName('header');
   // console.log(headerTag);
    headerTag.innerHTML = header;
  }

    return (
        <div class={`${style.TextBlock} uk-container`}>
            <div class={style.howWorksText}>
                <h1 className="header">{header}</h1>
                <div class={style.text}>{content.text}</div>
                <div class={style.buttons}>
                  <Link href=""><button class='red-btn main-btn'>Sign up <span>free</span> <span>& Become Pro</span></button></Link>
                  <button class='white-btn main-btn' onClick={downloadApp}>Download app</button>
                </div>
            </div>
            <div class={style.image}>
              <img src={content.img} alt={content.title} />
            </div>
        </div> 
	)
};

export default TextBlockMain;