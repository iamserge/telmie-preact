import { h } from 'preact';
import Article from './article.js'
import Hr from '../../hr'
import style from './style.scss';

const ArticleColumn = ({articles = [], locale}) => {
    return (
        <div class={style.articleCol}>
            {articles.map(article => (
                [<Article key={article.date} {...article} locale={locale}/>, 
                    <Hr color='rgb(245,246,248)' margin={20} />]
            ))}
        </div>
	)
}

export default ArticleColumn;