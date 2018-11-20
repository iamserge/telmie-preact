import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const greetings = [ 'Привет', 'Hola', 'Hello', '嗨', 'Oi', 'مرحبا', 'Bonjour' ];

class AnimatedImage extends Component {

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
    let currentCount = Math.floor(Math.random() * (greetings.length - 1));
    this.setState({ currentCount });
  };

  render() {
    const {content} = this.props;
    const {currentCount} = this.state;

    return (
        <div class={style.animatedImage}>
          <img src={content.img} alt={content.title}/>
          <span class={`${style.greeting} ${style[`greeting${currentCount}`]}`}>
            {greetings[currentCount]}!
          </span>          
        </div>
    )
  }
}

export default AnimatedImage;