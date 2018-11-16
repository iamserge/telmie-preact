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
    let index = Math.floor(Math.random()*greetings.length);
    this.setState({ currentCount: index });
  };

  render() {
    const content = this.props.content;

    return (
        <div class={style.animatedImage}>
          <img src={content.img} alt={content.title}/>
          <span key="greetings" className={`greeting${this.state.currentCount}`}>{greetings[this.state.currentCount]}!</span>
        </div>
    )
  }
}

export default AnimatedImage;