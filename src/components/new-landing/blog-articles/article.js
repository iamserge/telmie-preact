import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';
import { langRoutes } from "../../app";
import { langs, EN, AE } from "../../../utils/consts";

const Article = ({id, title, date, link, locale = EN }) => {
    return (
        <div class={style.article}>
            <Link href={langRoutes(langs[locale].code,link)} 
                class={`${style.title} ${locale===AE && 'arabic-text'}`}>{title}</Link>
            <div class={style.date}>{new Date(date).customParse()}</div>
        </div>
	)
}

export default Article;