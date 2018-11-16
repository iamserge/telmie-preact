import { h } from 'preact';
import style from './style.scss';
import { Link } from 'preact-router';

const Article = ({id, title, date, link}) => {
    return (
        <div class={style.article}>
            <Link href={link} class={style.title}>{title}</Link>
            <div class={style.date}>{new Date(date).customParse()}</div>
        </div>
	)
}

export default Article;