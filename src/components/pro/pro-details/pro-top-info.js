import { h, Component } from 'preact';
import style from './style.scss';
import FontAwesome from 'react-fontawesome';
import { Link } from 'preact-router';
import {routes} from '../../app'


export default class ProTopInfo extends Component {
  
	render({person, pro}) {

		return (<div>
			<div className={style.nameAndTitle}>
				<span className={style.proRoundel}>PRO</span>
				<h2>{person.name} {person.lastName}</h2>
				<h3>{pro.profession}</h3>
			</div>
			<div className={style.prof}>
				<Link href={routes.SEARCH_FOR_COMP + pro.category} >{pro.category}</Link>
				<FontAwesome name="angle-right"/>
				<Link href={routes.SEARCH_FOR_COMP + pro.subCategory} >{pro.subCategory}</Link>
			</div>
        </div>)
	}
}
