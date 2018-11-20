import { h } from 'preact';
import style from './style.scss';
import { Link, route } from 'preact-router';

const BigArticle = ({title, date,link, img}) => {    
    const articleStyle =  {background: `url('${img}') no-repeat center`, backgroundSize: "cover"}
    const onClick = () => route(link);
    return (
        <div href={link} class={style.bigArticle} style={articleStyle}>
            <div class={style.articleInfo}>
                <div class={style.date}>{new Date(date).customParse()}</div>
                <Link class={style.title} href={link}>{title}</Link>
                <button class='red-btn' onClick={onClick}>Full story</button>
            </div>
        </div>
	)
}

export default BigArticle;