import { h } from 'preact';
import style from './style.scss';

const BigArticle = ({title, date, img}) => {
    const gotoHandler = () => console.log('goto link: ', link);
    

    const articleStyle =  {background: `url('${img}') no-repeat center`, backgroundSize: "auto 100%"}

    return (
        <div class={style.bigArticle} style={articleStyle}>
            <div class={style.articleInfo}>
                <div class={style.date}>{new Date(date).customParse()}</div>
                <div class={style.title}>{title}</div>
                <button class='red-btn'>Full story</button>
            </div>
        </div>
	)
}

export default BigArticle;