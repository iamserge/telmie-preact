import { h, Component } from 'preact';
import style from './style.scss';
import ReactStars from 'react-stars';
import { apiRoot } from '../../../api'


export default class UserVerticalInfo extends Component {

	render({person}) {
		const { pro } = person;

		return (
			<div className={style.imageContainer}>
				<div className={style.image}>
					{ (person.avatar != null) ? (
						<img class="hexmask" src={apiRoot + 'image/' + person.avatar.id} alt={person.name + ' ' + person.lastName} />
					) : (
						<img class="hexmask" src="/assets/nouserimage.jpg" alt={person.name + ' ' + person.lastName} />
					)}
				</div>
				{ pro && <div className={style.raiting}>
						<span>
							{(pro.review != null) ? pro.review.count : 0} sessions
						</span>
						<ReactStars
							count={5}
							value={(pro.review != null) ? pro.review.rating : 0}
							edit={false}
							size={25} />
					</div> }
			</div>
		)
	}
}
