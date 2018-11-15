import { h } from 'preact';
import style from './style.scss';


const StepItem = ({step, isLast}) => {
    const stepImg = isLast ? 
        step.icon ? 
            <div class={style.iconContainer}><img src={step.icon}/></div>
            : <div class={`${style.count} ${style.countLast}`}>{step.id}</div> 
        : <div class={`${style.count}`}>{step.id}</div>;
        
    return (
        <div class={style.step} key={step.id}>
            <span class={style.line}></span>
            {stepImg}
            <div class={style.title}>{step.title}</div>
            <div>{step.text}</div>
        </div>
    )
};

export default StepItem;