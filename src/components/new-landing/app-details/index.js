import { h } from 'preact';
import style from './style.scss';

const AppDetails = ({appLink=''}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`uk-container ${style.iosAppContainer}`}>
            <div class={style.textContent}>
                <div class={style.header}>Easy to use iOS app</div>
                <div class={style.subHeader}>With the Telmie iOS app you can browse experts, arrange video calls and get real-time advice wherever, whenever.</div>
                <div class={style.btn}>
                    <img onClick={downloadApp} src='/assets/new-landing-page/appStoreCoupon.png' alt=''/>
                </div>
            </div>
            <div class={style.imgContent}>
                <img class={style.appScreen} src='/assets/new-landing-page/appScreen.png' alt="App Screen"/>
                <img class={style.combinedShapeLeft} src='/assets/new-landing-page/combinedShape_sq.png' alt='shape1'/>
                <img class={style.combinedShapeRight} src='/assets/new-landing-page/combinedShape_sq.png' alt='shape2'/>
                <img class={style.polygon_large} src='/assets/new-landing-page/polygon_violet.png' alt='shape3'/>
                <img class={style.polygon_small} src='/assets/new-landing-page/polygon_lightBlue.png' alt='shape4'/>
            </div>
        </div>
	)
}

export default AppDetails;