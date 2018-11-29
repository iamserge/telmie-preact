import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';
import { langRoutes } from "../../app";
import { langs } from "../../../utils/consts";

const Article = ({id, title, date, link, locale}) => {
    return (
        <div class={style.article}>
            <Link href={langRoutes(langs[locale].lang,link)} class={style.title}>{title}</Link>
            <div class={style.date}>{new Date(date).customParse()}</div>
        </div>
	)
}

export default Article;