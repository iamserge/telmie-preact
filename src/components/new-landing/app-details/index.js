import { h } from 'preact';
import style from './style.scss';

const AppDetails = ({content = {}, appLink=''}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`uk-container ${style.iosAppContainer}`}>
            <div class={style.textContent}>
                <div class={style.header}>{content.title}</div>
                {content.text ? <div class={style.subHeader}>{content.text}</div> : null}
                <div class={style.btn}>
                    <img onClick={downloadApp} src='/assets/new-landing-page/appStoreCoupon.png' alt=''/>
                </div>
            </div>
            <div class={style.imgContent}>
                <img class={style.appScreen} src={content.img} alt="App Screen"/>
                {/*<img class={style.combinedShapeLeft} src='/assets/new-landing-page/combinedShape_sq.png' alt='shape1'/>
                <img class={style.combinedShapeRight} src='/assets/new-landing-page/combinedShape_sq.png' alt='shape2'/>
                <img class={style.polygon_large} src='/assets/new-landing-page/polygon_violet.png' alt='shape3'/>
    <img class={style.polygon_small} src='/assets/new-landing-page/polygon_lightBlue.png' alt='shape4'/>*/}
                
            </div>
        </div>
	)
}

export default AppDetails;