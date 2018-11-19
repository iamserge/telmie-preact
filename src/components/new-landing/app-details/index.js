import { h } from 'preact';
import style from './style.scss';

const AppDetails = ({content = {}, appLink=''}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`uk-container ${style.iosAppContainer}`}>
            <div class={style.textContent}>
                <div class={style.header}>{content.title}</div>
                {content.text ? <div class={style.subHeader}>{content.text}</div> : null}
                
                <div class={style.btn} onClick={downloadApp}>

                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Badges" x="0px" y="0px" viewBox="44.2 19 128 40" enable-background="new 44.2 19 128 40" space="preserve">
                <g>
                    <path d="M168.2,59h-120c-2.2,0-4-1.8-4-4V23c0-2.2,1.8-4,4-4h120c2.2,0,4,1.8,4,4v32C172.2,57.2,170.4,59,168.2,59z"/>
                    <path fill="#FFFFFF" d="M71.2,38.8c0-3.1,2.6-4.6,2.7-4.7c-1.5-2.1-3.7-2.4-4.5-2.5c-1.9-0.2-3.8,1.1-4.7,1.1c-1,0-2.5-1.1-4.1-1.1   c-2.1,0-4,1.2-5.1,3.1c-2.2,3.8-0.6,9.4,1.5,12.5c1.1,1.5,2.3,3.2,3.9,3.1c1.6-0.1,2.2-1,4.1-1c1.9,0,2.4,1,4.1,1   c1.7,0,2.8-1.5,3.8-3c1.2-1.7,1.7-3.4,1.7-3.5C74.5,43.7,71.2,42.5,71.2,38.8z"/>
                    <path fill="#FFFFFF" d="M68.1,29.6c0.8-1.1,1.4-2.5,1.3-4c-1.2,0.1-2.8,0.8-3.6,1.9c-0.8,0.9-1.5,2.4-1.3,3.8   C65.8,31.4,67.2,30.6,68.1,29.6z"/>
                    <path fill="#FFFFFF" d="M94,50.1h-2.2l-1.2-3.8h-4.2l-1.1,3.8h-2.1l4.2-12.9h2.6L94,50.1z M90.2,44.7l-1.1-3.4   c-0.1-0.3-0.3-1.2-0.7-2.4h0c-0.1,0.5-0.3,1.4-0.6,2.4l-1.1,3.4H90.2z"/>
                    <path fill="#FFFFFF" d="M104.7,45.4c0,1.6-0.4,2.8-1.3,3.8c-0.8,0.8-1.7,1.2-2.9,1.2c-1.2,0-2.1-0.4-2.6-1.3h0v4.9h-2.1v-10   c0-1,0-2-0.1-3.1h1.8l0.1,1.5h0c0.7-1.1,1.7-1.7,3.1-1.7c1.1,0,2,0.4,2.7,1.3C104.3,42.8,104.7,43.9,104.7,45.4z M102.6,45.4   c0-0.9-0.2-1.7-0.6-2.2c-0.4-0.6-1-0.9-1.8-0.9c-0.5,0-1,0.2-1.4,0.5c-0.4,0.3-0.7,0.8-0.8,1.3c-0.1,0.3-0.1,0.5-0.1,0.6v1.6   c0,0.7,0.2,1.2,0.6,1.7c0.4,0.5,1,0.7,1.6,0.7c0.8,0,1.4-0.3,1.8-0.9C102.4,47.2,102.6,46.4,102.6,45.4z"/>
                    <path fill="#FFFFFF" d="M115.4,45.4c0,1.6-0.4,2.8-1.3,3.8c-0.8,0.8-1.7,1.2-2.9,1.2c-1.2,0-2.1-0.4-2.6-1.3h0v4.9h-2.1v-10   c0-1,0-2-0.1-3.1h1.8l0.1,1.5h0c0.7-1.1,1.7-1.7,3.1-1.7c1.1,0,2,0.4,2.7,1.3C115,42.8,115.4,43.9,115.4,45.4z M113.3,45.4   c0-0.9-0.2-1.7-0.6-2.2c-0.4-0.6-1-0.9-1.8-0.9c-0.5,0-1,0.2-1.4,0.5c-0.4,0.3-0.7,0.8-0.8,1.3c-0.1,0.3-0.1,0.5-0.1,0.6v1.6   c0,0.7,0.2,1.2,0.6,1.7c0.4,0.5,1,0.7,1.6,0.7c0.8,0,1.4-0.3,1.8-0.9C113.1,47.2,113.3,46.4,113.3,45.4z"/>
                    <path fill="#FFFFFF" d="M127.4,46.5c0,1.1-0.4,2-1.1,2.7c-0.8,0.8-2,1.1-3.5,1.1c-1.4,0-2.5-0.3-3.3-0.8l0.5-1.7   c0.9,0.5,1.9,0.8,3,0.8c0.8,0,1.4-0.2,1.8-0.5c0.4-0.4,0.6-0.8,0.6-1.4c0-0.5-0.2-1-0.5-1.3c-0.4-0.4-1-0.7-1.8-1   c-2.3-0.8-3.4-2.1-3.4-3.7c0-1.1,0.4-1.9,1.2-2.6c0.8-0.7,1.8-1,3.2-1c1.2,0,2.1,0.2,2.9,0.6l-0.5,1.7c-0.7-0.4-1.5-0.6-2.5-0.6   c-0.7,0-1.3,0.2-1.7,0.5c-0.3,0.3-0.5,0.7-0.5,1.2c0,0.5,0.2,0.9,0.6,1.3c0.3,0.3,1,0.6,1.9,1c1.1,0.4,1.9,1,2.5,1.6   C127.1,44.9,127.4,45.6,127.4,46.5z"/>
                    <path fill="#FFFFFF" d="M134.2,42.4h-2.3v4.5c0,1.1,0.4,1.7,1.2,1.7c0.4,0,0.7,0,0.9-0.1l0.1,1.6c-0.4,0.2-0.9,0.2-1.6,0.2   c-0.8,0-1.5-0.2-1.9-0.7c-0.5-0.5-0.7-1.3-0.7-2.5v-4.7h-1.4v-1.6h1.4v-1.7l2-0.6v2.3h2.3V42.4z"/>
                    <path fill="#FFFFFF" d="M144.5,45.4c0,1.4-0.4,2.6-1.2,3.5c-0.9,0.9-2,1.4-3.4,1.4c-1.4,0-2.5-0.5-3.3-1.4c-0.8-0.9-1.2-2-1.2-3.4   c0-1.4,0.4-2.6,1.3-3.5c0.8-0.9,2-1.4,3.4-1.4c1.4,0,2.5,0.5,3.3,1.4C144.1,42.9,144.5,44,144.5,45.4z M142.3,45.5   c0-0.9-0.2-1.6-0.6-2.2c-0.4-0.7-1.1-1.1-1.9-1.1c-0.8,0-1.5,0.4-1.9,1.1c-0.4,0.6-0.6,1.4-0.6,2.2c0,0.9,0.2,1.6,0.6,2.2   c0.4,0.7,1.1,1.1,1.9,1.1c0.8,0,1.4-0.4,1.9-1.1C142.1,47.1,142.3,46.3,142.3,45.5z"/>
                    <path fill="#FFFFFF" d="M151.2,42.6c-0.2,0-0.4-0.1-0.7-0.1c-0.7,0-1.3,0.3-1.7,0.8c-0.3,0.5-0.5,1.1-0.5,1.8v4.9h-2.1l0-6.4   c0-1.1,0-2-0.1-2.9h1.8l0.1,1.8h0.1c0.2-0.6,0.6-1.1,1-1.5c0.5-0.3,1-0.5,1.5-0.5c0.2,0,0.4,0,0.5,0V42.6z"/>
                    <path fill="#FFFFFF" d="M160.4,45c0,0.4,0,0.7-0.1,0.9h-6.2c0,0.9,0.3,1.6,0.9,2.1c0.5,0.4,1.2,0.7,2,0.7c0.9,0,1.8-0.1,2.5-0.4   l0.3,1.4c-0.9,0.4-1.9,0.6-3.1,0.6c-1.4,0-2.6-0.4-3.4-1.3c-0.8-0.8-1.2-2-1.2-3.4c0-1.4,0.4-2.6,1.1-3.5c0.8-1,1.9-1.5,3.3-1.5   c1.3,0,2.4,0.5,3,1.5C160.2,42.9,160.4,43.9,160.4,45z M158.5,44.5c0-0.6-0.1-1.1-0.4-1.6c-0.4-0.6-0.9-0.9-1.6-0.9   c-0.7,0-1.2,0.3-1.6,0.8c-0.3,0.4-0.5,1-0.6,1.6H158.5z"/>
                    <path fill="#FFFFFF" d="M89.6,29.3c0,1.1-0.3,2-1,2.6c-0.6,0.5-1.5,0.8-2.7,0.8c-0.6,0-1.1,0-1.5-0.1v-6.2c0.5-0.1,1.1-0.1,1.8-0.1   c1.1,0,1.9,0.2,2.5,0.7C89.2,27.5,89.6,28.3,89.6,29.3z M88.5,29.3c0-0.7-0.2-1.3-0.6-1.7c-0.4-0.4-1-0.6-1.7-0.6   c-0.3,0-0.6,0-0.8,0.1v4.7c0.1,0,0.4,0,0.7,0c0.8,0,1.4-0.2,1.8-0.6C88.3,30.8,88.5,30.1,88.5,29.3z"/>
                    <path fill="#FFFFFF" d="M95.2,30.3c0,0.7-0.2,1.3-0.6,1.7c-0.4,0.5-1,0.7-1.7,0.7c-0.7,0-1.2-0.2-1.6-0.7c-0.4-0.4-0.6-1-0.6-1.7   c0-0.7,0.2-1.3,0.6-1.7c0.4-0.5,1-0.7,1.7-0.7c0.7,0,1.2,0.2,1.6,0.7C95,29,95.2,29.6,95.2,30.3z M94.2,30.3c0-0.4-0.1-0.8-0.3-1.1   c-0.2-0.4-0.5-0.5-0.9-0.5c-0.4,0-0.7,0.2-0.9,0.5c-0.2,0.3-0.3,0.7-0.3,1.1c0,0.4,0.1,0.8,0.3,1.1c0.2,0.4,0.5,0.5,0.9,0.5   c0.4,0,0.7-0.2,0.9-0.6C94.1,31.1,94.2,30.7,94.2,30.3z"/>
                    <path fill="#FFFFFF" d="M102.9,28l-1.4,4.6h-0.9l-0.6-2c-0.2-0.5-0.3-1-0.4-1.5h0c-0.1,0.5-0.2,1-0.4,1.5l-0.6,2h-0.9L96.2,28h1   l0.5,2.2c0.1,0.5,0.2,1,0.3,1.5h0c0.1-0.4,0.2-0.9,0.4-1.5l0.6-2.2h0.8l0.6,2.1c0.2,0.5,0.3,1,0.4,1.5h0c0.1-0.5,0.2-1,0.3-1.5   l0.6-2.1H102.9z"/>
                    <path fill="#FFFFFF" d="M108.1,32.6h-1V30c0-0.8-0.3-1.2-0.9-1.2c-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.5-0.3,0.8v2.7h-1v-3.3   c0-0.4,0-0.8,0-1.3h0.9l0,0.7h0c0.1-0.2,0.3-0.4,0.5-0.6c0.3-0.2,0.6-0.3,0.9-0.3c0.4,0,0.8,0.1,1.1,0.4c0.4,0.3,0.5,0.8,0.5,1.5   V32.6z"/>
                    <path fill="#FFFFFF" d="M110.9,32.6h-1v-6.7h1V32.6z"/>
                    <path fill="#FFFFFF" d="M116.9,30.3c0,0.7-0.2,1.3-0.6,1.7c-0.4,0.5-1,0.7-1.7,0.7c-0.7,0-1.2-0.2-1.6-0.7c-0.4-0.4-0.6-1-0.6-1.7   c0-0.7,0.2-1.3,0.6-1.7s1-0.7,1.7-0.7c0.7,0,1.2,0.2,1.6,0.7C116.7,29,116.9,29.6,116.9,30.3z M115.9,30.3c0-0.4-0.1-0.8-0.3-1.1   c-0.2-0.4-0.5-0.5-0.9-0.5c-0.4,0-0.7,0.2-0.9,0.5c-0.2,0.3-0.3,0.7-0.3,1.1c0,0.4,0.1,0.8,0.3,1.1c0.2,0.4,0.5,0.5,0.9,0.5   c0.4,0,0.7-0.2,0.9-0.6C115.8,31.1,115.9,30.7,115.9,30.3z"/>
                    <path fill="#FFFFFF" d="M121.8,32.6h-0.9l-0.1-0.5h0c-0.3,0.4-0.8,0.6-1.3,0.6c-0.4,0-0.8-0.1-1-0.4c-0.2-0.3-0.4-0.6-0.4-0.9   c0-0.6,0.2-1,0.7-1.3c0.5-0.3,1.1-0.4,2-0.4v-0.1c0-0.6-0.3-0.9-0.9-0.9c-0.5,0-0.8,0.1-1.2,0.3l-0.2-0.7c0.4-0.3,0.9-0.4,1.6-0.4   c1.2,0,1.8,0.6,1.8,1.9v1.7C121.8,32,121.8,32.3,121.8,32.6z M120.8,31v-0.7c-1.1,0-1.7,0.3-1.7,0.9c0,0.2,0.1,0.4,0.2,0.5   c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.4-0.1,0.6-0.2c0.2-0.1,0.3-0.3,0.4-0.5C120.8,31.2,120.8,31.1,120.8,31z"/>
                    <path fill="#FFFFFF" d="M127.6,32.6h-0.9l0-0.7h0c-0.3,0.6-0.8,0.8-1.5,0.8c-0.6,0-1-0.2-1.4-0.6c-0.4-0.4-0.5-1-0.5-1.7   c0-0.7,0.2-1.3,0.6-1.8c0.4-0.4,0.9-0.6,1.4-0.6c0.6,0,1,0.2,1.3,0.6h0v-2.6h1v5.4C127.6,31.8,127.6,32.2,127.6,32.6z M126.6,30.7   v-0.8c0-0.1,0-0.2,0-0.3c-0.1-0.2-0.2-0.4-0.4-0.6c-0.2-0.2-0.4-0.2-0.7-0.2c-0.4,0-0.7,0.2-0.9,0.5c-0.2,0.3-0.3,0.7-0.3,1.2   c0,0.5,0.1,0.8,0.3,1.1c0.2,0.3,0.5,0.5,0.9,0.5c0.3,0,0.6-0.1,0.8-0.4C126.5,31.3,126.6,31,126.6,30.7z"/>
                    <path fill="#FFFFFF" d="M136.3,30.3c0,0.7-0.2,1.3-0.6,1.7c-0.4,0.5-1,0.7-1.7,0.7c-0.7,0-1.2-0.2-1.6-0.7c-0.4-0.4-0.6-1-0.6-1.7   c0-0.7,0.2-1.3,0.6-1.7c0.4-0.5,1-0.7,1.7-0.7c0.7,0,1.2,0.2,1.6,0.7C136.1,29,136.3,29.6,136.3,30.3z M135.2,30.3   c0-0.4-0.1-0.8-0.3-1.1c-0.2-0.4-0.5-0.5-0.9-0.5c-0.4,0-0.7,0.2-0.9,0.5c-0.2,0.3-0.3,0.7-0.3,1.1c0,0.4,0.1,0.8,0.3,1.1   c0.2,0.4,0.5,0.5,0.9,0.5c0.4,0,0.7-0.2,0.9-0.6C135.1,31.1,135.2,30.7,135.2,30.3z"/>
                    <path fill="#FFFFFF" d="M141.8,32.6h-1V30c0-0.8-0.3-1.2-0.9-1.2c-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.5-0.3,0.8v2.7h-1v-3.3   c0-0.4,0-0.8,0-1.3h0.9l0,0.7h0c0.1-0.2,0.3-0.4,0.5-0.6c0.3-0.2,0.6-0.3,0.9-0.3c0.4,0,0.8,0.1,1.1,0.4c0.4,0.3,0.5,0.8,0.5,1.5   V32.6z"/>
                    <path fill="#FFFFFF" d="M148.6,28.8h-1.1V31c0,0.6,0.2,0.8,0.6,0.8c0.2,0,0.3,0,0.5,0l0,0.8c-0.2,0.1-0.5,0.1-0.8,0.1   c-0.4,0-0.7-0.1-0.9-0.4c-0.2-0.2-0.3-0.7-0.3-1.2v-2.3h-0.7V28h0.7v-0.8l1-0.3V28h1.1V28.8z"/>
                    <path fill="#FFFFFF" d="M154,32.6h-1V30c0-0.8-0.3-1.2-0.9-1.2c-0.5,0-0.8,0.2-1,0.7c0,0.1,0,0.2,0,0.4v2.7h-1v-6.7h1v2.8h0   c0.3-0.5,0.8-0.8,1.4-0.8c0.4,0,0.8,0.1,1,0.4c0.3,0.3,0.5,0.9,0.5,1.5V32.6z"/>
                    <path fill="#FFFFFF" d="M159.5,30.1c0,0.2,0,0.3,0,0.5h-3c0,0.5,0.2,0.8,0.4,1c0.3,0.2,0.6,0.3,1,0.3c0.5,0,0.9-0.1,1.2-0.2   l0.2,0.7c-0.4,0.2-0.9,0.3-1.5,0.3c-0.7,0-1.3-0.2-1.7-0.6c-0.4-0.4-0.6-1-0.6-1.7c0-0.7,0.2-1.3,0.6-1.7c0.4-0.5,0.9-0.7,1.6-0.7   c0.7,0,1.2,0.2,1.5,0.7C159.4,29,159.5,29.5,159.5,30.1z M158.6,29.8c0-0.3-0.1-0.6-0.2-0.8c-0.2-0.3-0.4-0.4-0.8-0.4   c-0.3,0-0.6,0.1-0.8,0.4c-0.2,0.2-0.3,0.5-0.3,0.8H158.6z"/>
                </g>
                </svg>
                
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