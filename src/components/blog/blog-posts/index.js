import { h, Component } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import { CarouselProvider, Slider, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

class BlogPosts extends Component {

  constructor(props) {
    super(props);
    this.state = { visibleSlides: 5 };
  }

  updateNumberOfSlides() {
    if(window.screen.width <= 640){
      this.setState({ visibleSlides: 1 });
    }
    else if (window.screen.width <= 980){
      this.setState({ visibleSlides: 2 });
    }
    else if (window.screen.width <= 1200){
      this.setState({ visibleSlides: 3 });
    }
    else if (window.screen.width <= 1500){
      this.setState({ visibleSlides: 4 });
    }
  }

  componentWillMount() {
    this.updateNumberOfSlides();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateNumberOfSlides());
  }


  render(){
    const allPosts = this.props.blogPosts;

    return (
      <div>
        <div class={style.blogPosts}>

          <CarouselProvider
            className={style.blogPostsSlider}
            naturalSlideWidth={294}
            naturalSlideHeight={372}
            totalSlides={allPosts.length}
            visibleSlides={this.state.visibleSlides}
            currentSlide={1}
            dragEnabled={false}
          >
            <div class={`${style.blogPostsTitle} uk-container`}>
              <h3>Other posts</h3>
              <div class={style.blogPostsArrows}>
                <ButtonBack><FontAwesome name="angle-left" size="2x" /></ButtonBack>
                <ButtonNext><FontAwesome name="angle-right" size="2x" /></ButtonNext>
              </div>
            </div>
            <Slider>
              {allPosts.map(post => (
                <li class={style.blogPost} key={post.id} style={{
                  background: `url('${post.img}') no-repeat center`,
                  backgroundSize: "auto 100%"
                }}>
                  <div class={style.blogPostDescription}>
                    <p class={style.date}>{post.date}</p>
                    {post.title}
                    <Link href={post.link} class="red-btn">Full story</Link>
                  </div>
                </li>
              ))}
            </Slider>
          </CarouselProvider>
        </div>
      </div>
    )
  }
}

export default BlogPosts;