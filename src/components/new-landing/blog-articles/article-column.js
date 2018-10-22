import { h } from 'preact';
import Article from './article.js'
import Hr from '../../hr'
import style from './style.scss';

const ArticleColumn = ({articles = []}) => {
    return (
        <div class={style.articleCol}>
            {articles.map(article => (
                [<Article key={article.date} {...article}/>, 
                    <Hr color='rgb(245,246,248)' margin={20} />]
            ))}
        </div>
	)
}

export default ArticleColumn;