import { h } from 'preact';
import Video from '../../homepage/video';
import { langPack } from "../../../utils/langPack";
import { EN } from "../../../utils/consts";
import style from './style.scss';

const HowWorksDetails = ({content, appLink = '', locale=EN }) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.howWorksContainer} uk-container`}>
            <div class={style.howWorksText}>
                <div class={style.header}>{content.title}</div>
                <div style={{marginBottom: 40}}>{content.text}</div>
                <button class='red-btn' onClick={downloadApp}>{langPack[locale].DOWNLOAD_APP_BTN}</button>
            </div>
            <div class={style.howWorksVideo}>
                <Video videoId = { content.videoID } />
            </div>
        </div> 
	)
}

export default HowWorksDetails;