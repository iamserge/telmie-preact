import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import { langPack } from "../../../utils/langPack";
import style from './style.scss';

const InfoComponent = ({mainSection, appLink, locale = 'en-us' }) => {
    const downloadApp = () => appLink && window.open(appLink);
    const titleObj = mainSection.title.split('{words}');
    const words = mainSection.typedWords.split(',');
    return (
        <div class={`${style.infoContainer} uk-container-big`}>
            <div class={style.title}>
              {titleObj[0]}<AutoPrintText words={words}/>{/*titleObj[1]*/}
            </div>
            <div class={style.subTitle}>{mainSection.subTitle}</div>

            <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;