import { h } from 'preact';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';

import style from './style.scss';

const WhyChooseUs = ({reasons = []}) => {

    return (
      <div class={style.blockBg}>
        <div class={style.blockBgInner}>
          <h2>Why choose us</h2>

          <div class={style.steps}>
            {reasons.map(reason => (
                <div class={style.step} key={reason.icon}>
                  <FontAwesome name={reason.icon} size='2x'/>
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