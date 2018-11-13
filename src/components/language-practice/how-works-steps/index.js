import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';


const HowWorksSteps = ({content = [], appLink = ''}) => {
  const downloadApp = () => appLink && window.open(appLink);

  return (
    <div class={style.blockBg}>
      <div class={style.blockBgInner}>
        <h2>How it works</h2>

        <div class={style.steps}>
          {content.map(step => (
              <div class={style.step} key={step.id}>
                <span class={style.line}></span>
                <div class={step.id=='$' ? (`${style.count} ${style.countLast}`) : style.count}>{step.id}</div>
                <div class={style.title}>{step.title}</div>
                <div>{step.text}</div>
              </div>
            ))}
        </div>

        <button class='red-btn' onClick={downloadApp}>Download app</button>
{/*
        <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
*/}
      </div>
    </div>
  )
};

export default HowWorksSteps;