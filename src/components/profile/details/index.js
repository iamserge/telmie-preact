import { h, Component } from 'preact';
import style from './style.scss';
import Spinner from '../../global/spinner';
import { Link } from 'preact-router';
import FontAwesome from 'react-fontawesome';
import { changeDateISOFormat } from '../../../utils/index'
import { routes } from '../../app'


export default class Details extends Component {

	render({user}) {
		const dateOfBirth = (user.dateOfBirth != null) ? changeDateISOFormat(user.dateOfBirth) : 'TBC';

		return (
			<div className={style.details}>
				<h2>
					Your details
					<Link href={routes.EDIT_PROFILE}>Edit <FontAwesome name="pencil" /></Link>
				</h2>
				<div className={style.inner}>
					<div>
						<span className={style.key}>Name:</span>
						<span className={style.value}>{user.name}</span>
					</div>
					<div>
						<span className={style.key}>Last name:</span>
						<span className={style.value}>{user.lastName}</span>
					</div>
					<div>
						<span className={style.key}>Email:</span>
						<span className={style.value}>{user.email}</span>
					</div>
					<div>
						<span className={style.key}>Date of birth:</span>
						<span className={style.value}>{ dateOfBirth }</span>
					</div>
					<div>
						<span className={style.key}>Location:</span>
						<span className={style.value}>{(user.location != null) ? user.location : 'TBC'}</span>
					</div>
					<div>
						<span className={style.key}>Mobile:</span>
						<span className={style.value}>{(user.mobile != null) ? user.mobile : 'TBC'}</span>
					</div>

				</div>
			</div>
		)
	}
}
