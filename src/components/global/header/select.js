import { h } from 'preact';

import { routes } from '../../app'
import { langs } from '../../../utils/consts'
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
            item = 'Language practice';
            listItems = [
                <li><Link href={routes.IMMIGRATION_LAW}>Immigration advice</Link></li>,
            ];
            break;
        case routes.IMMIGRATION_LAW:
            item = 'Immigration advice';
            listItems = [
                <li><Link href={routes.LANGUAGE_PRACTICE}>Language practice</Link></li>,
            ];
            break;
        case routes.LANGUAGE_LEARNERS:
            item = 'Изучение языка';
            listItems = [ ];
            break;
        default:
            break;
    }
    return {item, listItems}
}

const renderLocale = (props) => {
    const changeLocalization = (code) => () => props.changeLocale(code);
    
    let item = emoji(langs[props.locale].emoji),
        listItems = [];

        listItems = renderExcept(props.locale, Object.values(langs), true).map(el => (
            <li onClick={changeLocalization(el.code)} key={el.code}>{emoji(el.emoji)}</li>
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