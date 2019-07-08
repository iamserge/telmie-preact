import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';
import ReactStars from 'react-stars'
import { apiRoot } from '../../../api'
import { route } from 'preact-router';
import { routes } from "../../app";

export default class Pro extends Component {
	goToPro = (id) => route(routes.PRO_FOR_COMP + id);

	render({person = {}}) {
		return (
			<div class={style.person} onClick={()=>{this.goToPro(person.id)}}>
				<div className={style.image}>
					{ (person.avatar != null) ? (
						<img src={apiRoot + 'image/' + person.avatar.id} alt={person.name + ' ' + person.lastName} />
					) : (
						<img src="/assets/nouserimage.jpg" alt={person.name + ' ' + person.lastName} />
					)}
				</div>
				<div className={style.info}>
					<h2>{person.name} {person.lastName}</h2>
					<h3>{person.pro.profession} <div>{person.pro.category}</div></h3>
					<div className={style.raiting}>
						<span>
							{(person.pro.review != null) ? person.pro.review.count : 0} sessions
						</span>
						<ReactStars
						  count={5}
						  value={(person.pro.review != null) ? person.pro.review.rating : 0}
							edit={false}
							size={25} />
					</div>
				</div>
				<div className={style.price}>
					&pound;{person.pro.costPerMinute} /<span>min</span>
				</div>
			</div>
		)
	}
}
