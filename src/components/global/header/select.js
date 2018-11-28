import { h } from 'preact';

import { routes } from '../../app'
import { langs } from '../../../utils/consts'
import { langPack } from '../../../utils/langPack'
import { Link } from 'preact-router/match';
import FontAwesome from 'react-fontawesome';
import emoji from 'react-easy-emoji';

import style from './style.scss';

const renderExcept = (elem, arr=[], isLocale = false) => {
    return  isLocale ? 
        arr.filter(el => el.code !== elem)
        : arr.filter(el => { });
}

const renderServices = (props) => {
    let item = '',
        listItems = '';
    switch (props.curUrl) {
        case routes.LANGUAGE_PRACTICE:
            item = langPack[props.locale].SERVICES.LANGUAGE_PRACTICE;
            listItems = [
                <li><Link href={routes.IMMIGRATION_LAW}>{langPack[props.locale].SERVICES.IMMIGRATION_LAW}</Link></li>,
            ];
            break;
        case routes.IMMIGRATION_LAW:
            item = langPack[props.locale].SERVICES.IMMIGRATION_LAW;
            listItems = [
                <li><Link href={routes.LANGUAGE_PRACTICE}>{langPack[props.locale].SERVICES.LANGUAGE_PRACTICE}</Link></li>,
            ];
            break;
        case routes.LANGUAGE_LEARNERS:
            item = langPack[props.locale].SERVICES.LANGUAGE_LEARNERS;
            listItems = [ ];
            break;
        default:
            break;
    }
    return {item, listItems}
}

const renderLocale = (props) => {
    const changeLocalization = (code) => () => props.changeLocale(code);
    const renderLocaleItem = (el) => ([
        emoji(el.emoji, (code) => (
            <div class={style.flagContainer} 
                style={{backgroundImage: `url(https://twemoji.maxcdn.com/2/svg/${code}.svg)`}} />
        )),
        el.name
    ]);
    
    let item = '',
        listItems = [];

    item = renderLocaleItem(langs[props.locale]);

    listItems = renderExcept(props.locale, Object.values(langs), true).map(el => (
        <li onClick={changeLocalization(el.code)} key={el.code}>
            {renderLocaleItem(el)}
        </li>
    ));

    return { item, listItems }
}

const Select = (props) => {

    let {item, listItems} = props.isLocale ? 
        renderLocale(props) : renderServices(props);

    return (
        <div class={props.isLocale ? `${style.title} ${style.localeSelect}` : style.title }>
            { item }
            <FontAwesome name='angle-down'/>
            <ul>
                { listItems }
            </ul>
        </div>
    )
}

export default Select;