import { h } from 'preact';
import AutoPrintText from '../auto-print-text'
import Search from '../../global/search';
import SimpleSearch from '../../simple-search'
import { route } from 'preact-router';
import ReactGA from 'react-ga';

import { routes } from '../../app'
import { EN, AE, labelsGA } from "../../../utils/consts";
import style from './style.scss';

const InfoComponent = ({mainSection, locale = EN, ...props }) => {
    const titleObj = mainSection.title.split('{words}');
    const words = mainSection.typedWords.split(',');
    const { btnText, btnLink } = mainSection;

    const downloadApp = () => ReactGA.outboundLink({
        label: labelsGA.downloadAppClick
    }, () => btnLink && window.location.assign(btnLink));

    const routeHandler = (searchTerm) => {
        props.isLogin ? (
          searchTerm && route(routes.SEARCH_FOR_COMP + searchTerm)
        ) : (
          route(routes.LOGIN_OR_SIGNUP)
        );
    };
    
    return (
        <div class={`${style.infoContainer} uk-container-big ${locale===AE && 'arabic-text'}`}>
            <div class={`${style.title}`}>
              {titleObj[0]}<AutoPrintText words={words}/>{/*titleObj[1]*/}

            </div>
            <div class={style.subTitle}>{mainSection.subTitle}</div>

            { props.isLogin && <SimpleSearch onSearch={routeHandler} 
                                            placeholder='Find a Pro'
                                            isHome={true}/> }

            {btnText && btnLink && 
                <button class='red-btn' onClick={downloadApp}>{btnText}</button> }
            {/*<button class='white-btn'>Sign up free</button>*/}
        </div>
	)
}

export default InfoComponent;