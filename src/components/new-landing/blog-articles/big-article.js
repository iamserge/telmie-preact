import { h } from 'preact';
import style from './style.scss';
import { Link, route } from 'preact-router';
import { langPack } from "../../../utils/langPack";
import { EN, langs } from "../../../utils/consts";
import { langRoutes } from "../../app";

const BigArticle = ({title, date,link, img, locale=EN}) => {    
    const articleStyle =  {background: `url('${img}') no-repeat center`, backgroundSize: "cover"}
    const onClick = () => route(langRoutes(langs[locale].lang,link));
    return (
        <div href={link} class={style.bigArticle} style={articleStyle}>
            <div class={style.articleInfo}>
                <div class={style.date}>{new Date(date).customParse()}</div>
                <Link class={style.title} href={langRoutes(langs[locale].lang,link)}>{title}</Link>
                <button class='red-btn' onClick={onClick}>{langPack[locale].FULL_STORY_BTN}</button>
            </div>
        </div>
	)
}

export default BigArticle;