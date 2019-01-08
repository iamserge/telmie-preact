import { h } from 'preact';
import ReactGA from 'react-ga';
import style from './style.scss';

const ProDetails = ({content={}}) => {
    const { btnText, btnLink } = content;

    const downloadApp = () => ReactGA.outboundLink({
        label: 'Clicked Download App'
    }, () => btnLink && window.open(btnLink));

    return (
        <div class={`uk-container ${style.proContainer}`}>
            <div class={style.textContent}>
                <div class={style.header}>{content.title}</div>
                <div class={style.content}>{content.text}</div>
                {/*<button class='red-btn'>Sign up & Become Pro</button>*/}
                { btnLink && btnText && 
                    <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
            </div>
            <div class={style.imgContent}>
                <img class={style.girl_pro} src='/assets/new-landing-page/girl_pro.png' alt='human'/>
                <img class={style.polygon_small} src='/assets/new-landing-page/polygon.png' alt='shape1' height="33" width="33"/>
                <img class={style.polygon_medium} src='/assets/new-landing-page/polygon.png' alt='shape2'/>
                <img class={style.polygon_large} src='/assets/new-landing-page/polygon_red.png' alt='shape3'/>
                <img class={style.combinedShape} src='/assets/new-landing-page/combinedShape.png' alt='shape4'/>
            </div>
        </div>
	)
}

export default ProDetails;