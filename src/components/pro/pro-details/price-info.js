import { h, Component } from 'preact';
import style from './style.scss';
import ReactStars from 'react-stars';


export default class PriceInfo extends Component {
  
	render({pro}) {

		return (
			<div className={style.priceContainer}>
					<div className={style.price}>
						&pound;{pro.costPerMinute} /<span>min</span>
					</div>
					<div className={style.raiting}>
						<span>
							{(pro.review != null) ? pro.review.count : 0} sessions
						</span>
						<ReactStars
							count={5}
							value={(pro.review != null) ? pro.review.rating : 0}
							edit={false}
							size={25} />
					</div>
				</div>
		)
	}
}
