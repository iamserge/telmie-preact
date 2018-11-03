import { h } from 'preact';
import ArticleCol from './article-column.js'
import BigArticle from './big-article.js'
import style from './style.scss';

const Blog = ({articles = [], featured}) => {

    Date.prototype.customParse = function(){
        return `${this.getDate()}.${this.getMonth() + 1}.${this.getFullYear()}`;
    };

    return (
        <div class={style.blogConteiner}>
            <BigArticle key={featured.uid} {...featured}/>
            {
                articles.reduce((accum, article) => {
                    return (
                        Array.isArray(accum[accum.length - 1]) && accum[accum.length - 1].length === 1 ? (
                            [
                                ...accum.slice(0,-1), 
                                <ArticleCol articles={[...accum[accum.length - 1], article]} />
                            ]
                        ) : (
                            [...accum, [article]]
                        )
                    )
                }, [])
            }
            
        </div>
	)
}

export default Blog;