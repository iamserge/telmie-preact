import { h } from 'preact';
import style from './style.scss';
import { route } from 'preact-router';

const BigArticle = ({title, date,link, img}) => {    
    const articleStyle =  {background: `url('${img}') no-repeat center`, backgroundSize: "auto 100%"}
    const onClick = () => route(link);
    return (
        <div href={link} class={style.bigArticle} style={articleStyle}>
            <div class={style.articleInfo}>
                <div class={style.date}>{new Date(date).customParse()}</div>
                <div class={style.title}>{title}</div>
                <button class='red-btn' onClick={onClick}>Full story</button>
            </div>
        </div>
	)
}

export default BigArticle;