import { h, Component } from 'preact';
import { Link, route } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Slider from "react-slick";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './style.scss';
import slickStyle from '../../../style/slick-styles.scss';

const SampleNextArrow = ({className, onClick, style}) => (
    <div class={className} onClick={onClick} style={style}>
      <FontAwesome name="angle-right" size="2x" />
    </div>
);

const SamplePrevArrow = ({className, onClick, style}) => (
    <div class={className} onClick={onClick} style={style}>
      <FontAwesome name="angle-left" size="2x" />
    </div>
);


class BlogPosts extends Component {

  constructor(props) {
    super(props);
  }

  onArticleClick = (link) => () => route(link);

  render(){
    const allPosts = this.props.blogPosts;
    const settings = {
      infinite: true,
      centerMode: true,
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
                  <div class={style.blogPostWrapper}>
                    <div class={style.blogPostDescription}>
                      <p class={style.date}>{post.date}</p>
                      <p class={style.title} onClick={this.onArticleClick(post.link)}>{post.title}</p>
                      <button class="red-btn" onClick={this.onArticleClick(post.link)}>Full story</button>
                    </div>
                  </div>
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