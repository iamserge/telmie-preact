import { h } from 'preact';
import { langPack } from "../../../utils/langPack";
import style from './style.scss';

const ProDetails = ({content={},appLink='', locale='en-us'}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`uk-container ${style.proContainer}`}>
            <div class={style.textContent}>
                <div class={style.header}>{content.title}</div>
                <div class={style.content}>{content.text}</div>
                {/*<button class='red-btn'>Sign up & Become Pro</button>*/}
                <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
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