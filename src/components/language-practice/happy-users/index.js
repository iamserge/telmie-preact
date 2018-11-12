import { h, Component } from 'preact';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import Slider from "react-slick";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import style from './style.scss';

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


class HappyUsers extends Component {

  constructor(props) {
    super(props);
    this.state = { visibleSlides: 5 };
  }


  render(){
    const reviews = this.props.reviews;
    const settings = {
      infinite: true,
      centerMode: true,
      adaptiveHeight: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      variableWidth: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 2
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
        <div class={style.reviews}>
          <h2>Happy Pros & Happy Users</h2>

          <Slider {...settings} className={style.reviewsSlider}>
            {reviews.map(review => (
              <div>
                <div class={style.review} key={review.id}>
                  <div class={style.avatar}>
                    <img src={review.avatar} alt={review.author} />
                  </div>
                  <p class={style.title}>{review.title}</p>
                  <p>{review.text}</p>
                  <p class={style.author}>{review.author}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )
  }
}

export default HappyUsers;