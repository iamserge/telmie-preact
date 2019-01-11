import { h, Component } from 'preact';
import ReactGA from 'react-ga';
import style from './style.scss';
import AnimatedImage from '../animated-image'
import { setEmphasizedText } from '../../../utils'
import { langPack } from "../../../utils/langPack";
import { EN, labelsGA } from "../../../utils/consts";

//const greetings = [ 'Привет', 'Hola', 'Hello', '嗨', 'Oi', 'مرحبا', 'Bonjour' ];

class TextBlockMain extends Component {

  constructor(props) {
    super(props);
  }

  downloadApp = () => ReactGA.outboundLink({
      label: labelsGA.downloadAppClick
    }, () => this.props.dBtn.btnLink && window.open(this.props.dBtn.btnLink));

  render() {
    const { content, locale = EN } = this.props;
    const { btnText, btnLink } =this.props.dBtn

    return (
      <div class={`${style.TextBlock} uk-container`}>
        <div class={style.howWorksText}>
          {setEmphasizedText(content, style.header)}
          <div class={style.text}>{content.text}</div>

          { btnText && btnLink && 
            <button class='red-btn' onClick={this.downloadApp}>{btnText}</button> }
          {/*
              <div class={style.buttons}>
                <Link href=""><button class='red-btn main-btn'>Sign up <span>free</span> <span>& Become Pro</span></button></Link>
                <button class='white-btn main-btn' onClick={{this.downloadApp}>Download app</button>
              </div>
*/}
        </div>
        <div class={style.image}>
          <AnimatedImage content={content} />
        </div>
      </div>
    )
  }
};

export default TextBlockMain;