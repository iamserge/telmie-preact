import { h, Component } from 'preact';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';
/*import { CarouselProvider, Slider, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';*/
import Slider from "react-slick";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './style.scss';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  let rightPosition;
  if(window.screen.width>1200){
    rightPosition = (window.screen.width-1200)/2;
  }else if(window.screen.width<1200){
    rightPosition = 15;
  } else if(window.screen.width<880){
    rightPosition = 0;
  }
  return (
    <div className={className} onClick={onClick} style={{ ...style, right: `${rightPosition}px` }}>
      <FontAwesome name="angle-right" size="2x" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  let rightPosition;
  if(window.screen.width>1200){
    rightPosition = (window.screen.width-1200)/2+64;
  }else if(window.screen.width<1200){
    rightPosition = 15+64;
  }
  return (
    <div className={className} onClick={onClick} style={{ ...style, right: `${rightPosition}px` }}>
      <FontAwesome name="angle-left" size="2x" />
    </div>
  );
}


class BlogPosts extends Component {

  constructor(props) {
    super(props);
    this.state = { visibleSlides: 5 };
  }


  render(){
    const allPosts = this.props.blogPosts;
    const settings = {
      infinite: true,
      centerMode: true,
      adaptiveHeight: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      variableWidth: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 979,
          settings: {
            slidesToShow: 2,
            swipeToSlide: true
          }
        },
        {
          breakpoint: 639,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    };

    return (
      <div>
        <div class={style.blogPosts}>

          <div class={`${style.blogPostsTitle} uk-container`}>
            <h3>Other posts</h3>
          </div>

          <Slider {...settings} className={style.blogPostsSlider}>
            {allPosts.map(post => (
              <div>
                <div class={style.blogPost} key={post.id} style={{
                  background: `url('${post.img}') no-repeat center`,
                  backgroundSize: "auto 100%"
                }}>
                  <Link href={post.link}>
                    <div class={style.blogPostDescription}>
                      <p class={style.date}>{post.date}</p>
                      <p class={style.title}>{post.title}</p>
                      <button class="red-btn">Full story</button>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }
}

export default BlogPosts;