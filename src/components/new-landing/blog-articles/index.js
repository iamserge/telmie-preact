import { h } from 'preact';
import ArticleCol from './article-column.js'
import BigArticle from './big-article.js'
import style from './style.scss';

const Blog = ({articles = [], featured, locale}) => {

    Date.prototype.customParse = function(){
        return `${this.getDate()}.${this.getMonth() + 1}.${this.getFullYear()}`;
    };

    return (
        <div class={style.blogConteiner}>
            <BigArticle key={featured.uid} {...featured} locale={locale}/>
            <div class={style.smallArticlesContainer}>
            {
                articles.reduce((accum, article) => {
                    return (
                        Array.isArray(accum[accum.length - 1]) && accum[accum.length - 1].length === 1 ? (
                            [
                                ...accum.slice(0,-1), 
                                <ArticleCol locale={locale} articles={[...accum[accum.length - 1], article]} />
                            ]
                        ) : (
                            [...accum, [article]]
                        )
                    )
                }, [])
            }
            </div>
        </div>
	)
}

export default Blog;