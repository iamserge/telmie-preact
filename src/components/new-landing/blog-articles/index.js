import { h } from 'preact';
import ArticleCol from './article-column.js'
import BigArticle from './big-article.js'
import style from './style.scss';

const Blog = ({articles = [], featured, locale}) => {
    let aLen = articles.length;
    Date.prototype.customParse = function(){
        return `${this.getDate()}.${this.getMonth() + 1}.${this.getFullYear()}`;
    };

    return (
        <div class={style.blogConteiner}>
            { featured && <BigArticle key={featured.uid} {...featured} locale={locale}/> }
            <div class={style.smallArticlesContainer}>
            {
                articles.map((article, i) => (
                    (i%2) ? 
                        <ArticleCol locale={locale} articles={articles.slice(i-1,i+1)} /> 
                        : ((i + 1) === aLen) && <ArticleCol locale={locale} articles={[article]} /> 
                ))
            }
            </div>
        </div>
	)
}

export default Blog;