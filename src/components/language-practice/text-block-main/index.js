import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import { setEmphasizedText } from '../../../utils'

const greetings = [ 'Гамарджоба', 'Hello', 'Ola', 'Konnichiwa', 'Hola', 'Marhaba' ];

class TextBlockMain extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 2000);
    this.setState({ currentCount: 3 });
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timer = () => {
    let index = Math.floor(Math.random()*greetings.length);
    this.setState({ currentCount: index });
  };

  downloadApp = () => this.props.appLink && window.open(this.props.appLink);

  render() {
    const content = this.props.content;

    return (
      <div class={`${style.TextBlock} uk-container`}>
        <div class={style.howWorksText}>
          <h1 class={style.header} dangerouslySetInnerHTML={setEmphasizedText(content)}>{content.title}</h1>
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
          <img src={content.img} alt={content.title}/>
          <span key="greetings" className={`greeting${this.state.currentCount}`}>{greetings[this.state.currentCount]}</span>
        </div>
      </div>
    )
  }
};

export default TextBlockMain;