import { h, Component } from 'preact';
import style from './style.scss';

/*componentDidMount: function() {
  this.countdown = setInterval(this.timer, 1000);
},*/


//class TextBlockMain extends Component {
const TextBlockMain = ({content, appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);
       let header;

  const greetings = [ 'Гамарджоба', 'Hello', 'Ola', 'Konnichiwa', 'Hola', 'Marhaba' ];
  let index = Math.floor(Math.random()*greetings.length);

  function setEmphasizedText() {
    if(content.title.indexOf(content.emphasized) + 1) {
      header = content.title.replace(content.emphasized, `<span>${content.emphasized}</span>`);
    }
    return {__html: header};
  }

  return (
      <div class={`${style.TextBlock} uk-container`}>
          <div class={style.howWorksText}>
              <h1 class={style.header} dangerouslySetInnerHTML={setEmphasizedText()}>{content.title}</h1>
              <div class={style.text}>{content.text}</div>
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
            <span className={`greeting${index}`}>{greetings[index]}</span>
          </div>
      </div>
	)
};

export default TextBlockMain;