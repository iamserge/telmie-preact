import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import Search from '../../global/search';
import ReactGA from 'react-ga';

import { EN } from "../../../utils/consts";
import style from './style.scss';

const InfoComponent = ({mainSection, locale = EN, ...props }) => {
    const titleObj = mainSection.title.split('{words}');
    const words = mainSection.typedWords.split(',');
    const { btnText, btnLink } = mainSection;

    const downloadApp = () => ReactGA.outboundLink({
        label: 'Clicked Download App'
    }, () => btnLink && window.open(btnLink));
    
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

            {btnText && btnLink && 
                <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;