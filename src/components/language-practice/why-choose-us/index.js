import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

const WhyChooseUs = ({reasons = []}) => {

    return (
      <div class={style.blockBg}>
        <div class={style.blockBgInner}>
          <h2>Why choose us</h2>

          <div class={style.steps}>
            {reasons.map(reason => (
                <div class={style.step} key={reason.id}>
                  <img class={style.icon} src={reason.icon} alt={style.title} />
                  <div class={style.title}>{reason.title}</div>
                  <div>{reason.text}</div>
                </div>
              ))}
          </div>

          <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
        </div>
      </div>
    )
};

export default WhyChooseUs;