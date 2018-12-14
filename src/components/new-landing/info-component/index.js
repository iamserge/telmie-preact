import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import Search from '../../global/search';

import { langPack } from "../../../utils/langPack";
import { EN } from "../../../utils/consts";
import style from './style.scss';

const InfoComponent = ({mainSection, appLink, locale = EN, ...props }) => {
    const downloadApp = () => appLink && window.open(appLink);
    const titleObj = mainSection.title.split('{words}');
    const words = mainSection.typedWords.split(',');
    return (
        <div class={`${style.infoContainer} uk-container-big`}>
            <div class={style.title}>
              {titleObj[0]}<AutoPrintText words={words}/>{/*titleObj[1]*/}

            </div>
            <div class={style.subTitle}>{mainSection.subTitle}</div>

            { props.isLogin && <Search hiddenSearchBox = {props.hiddenSearchBox} 
						hideSearchBox = { props.hideSearchBox } 
						isLogin = { props.isLogin } 
                        home= { true }/> }

            <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;