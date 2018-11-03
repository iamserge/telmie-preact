import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import style from './style.scss';

const InfoComponent = ({mainSection}) => {
    const downloadApp = () => appLink && window.open(appLink);

    return (
        <div class={`${style.infoContainer} uk-container-big`}>
            <div class={style.title}>
                <AutoPrintText mainSection={mainSection}/>
            </div>
            <div class={style.subTitle}>{mainSection.subTitle}</div>

            <button class='red-btn' onClick={downloadApp}>Download app</button>
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;