import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import AnimatedImage from '../animated-image'
import { setEmphasizedText } from '../../../utils'

//const greetings = [ 'Привет', 'Hola', 'Hello', '嗨', 'Oi', 'مرحبا', 'Bonjour' ];

class TextBlockMain extends Component {

  constructor(props) {
    super(props);
  }

  downloadApp = this.props.onDownloadApp ? 
    this.props.onDownloadApp 
    : () => this.props.appLink && window.open(this.props.appLink);

  render() {
    const content = this.props.content;

    return (
      <div class={`${style.TextBlock} uk-container`}>
        <div class={style.howWorksText}>
          {setEmphasizedText(content, style.header)}
          <div class={style.text}>{content.text}</div>

          <button class='red-btn' onClick={this.downloadApp}>Download app</button>
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