import { h } from 'preact';
import { Link } from 'preact-router';
import StepItem from './step'
import ReactGA from 'react-ga';
import { labelsGA } from "../../../utils/consts";
import style from './style.scss';


const HowWorksSteps = ({content = [], dBtn = {}, title}) => {
  const { btnText, btnLink } = dBtn;
  const downloadApp = () => ReactGA.outboundLink({
    label: labelsGA.downloadAppClick
  }, () => btnLink && window.open(btnLink));

  const stepsCount = content.length;

  return (
    <div class={style.blockBg}>
      <div class={style.blockBgInner}>
        <h2>{title.how_works_title}</h2>

        <div class={style.steps}>
          {content.map((step, index) => <StepItem step={step} isLast={stepsCount === (index + 1)}/>)}
        </div>

        { btnText && btnLink && 
          <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
{/*
        <Link href=""><button className="red-btn">Sign up & Become Pro</button></Link>
*/}
      </div>
    </div>
  )
};

export default HowWorksSteps;