import { h } from 'preact';
import style from './style.scss';

const Article = ({title, date, link}) => {
    const gotoHandler = () => console.log('goto link: ', link);


    return (
        <div class={style.article}>
            <div onClick={gotoHandler} class={style.title}>{title}</div>
            <div class={style.date}>{new Date(date).customParse()}</div>
        </div>
	)
}

export default Article;