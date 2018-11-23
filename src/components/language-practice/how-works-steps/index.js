import { h } from 'preact';
import { Link } from 'preact-router';
import StepItem from './step'
import style from './style.scss';


const HowWorksSteps = ({content = [], title, appLink = '', onDownloadApp}) => {
  const downloadApp = onDownloadApp ? onDownloadApp : () => appLink && window.open(appLink);

  const stepsCount = content.length;

  return (
    <div class={style.blockBg}>
      <div class={style.blockBgInner}>
        <h2>{title.how_works_title}</h2>

        <div class={style.steps}>
          {content.map((step, index) => <StepItem step={step} isLast={stepsCount === (index + 1)}/>)}
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