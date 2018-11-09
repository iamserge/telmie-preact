import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';


const HowWorksSteps = ({steps = []}) => {

    return (
      <div class={style.blockBg}>
        <div class={style.blockBgInner}>
          <h2>How it works</h2>

          <div class={style.steps}>
            {steps.map(step => (
                <div class={style.step} key={step.id}>
                  <span class={style.line}></span>
                  <div class={step.id=='$' ? (`${style.count} ${style.countLast}`) : style.count}>{step.id}</div>
                  <div class={style.title}>{step.title}</div>
                  <div>{step.text}</div>
                </div>
              ))}
          </div>

          <Link href="" className="red-btn">Sign up & Become Pro</Link>
        </div>
      </div>
    )
};

export default HowWorksSteps;