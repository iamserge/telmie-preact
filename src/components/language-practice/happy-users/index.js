import { h, Component } from 'preact';
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
  }

  render(){
    const reviews = this.props.content;
    const settings = {
      infinite: true,
      centerMode: true,
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
          breakpoint: 880,
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
                <div class={style.review} key={review.name}>
                  <div class={style.avatar}>
                    <img src={review.avatar} alt={review.name} />
                  </div>
                  <p class={style.title}>{review.title}</p>
                  <p>{review.text}</p>
                  <p class={style.author}>{review.name}</p>
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