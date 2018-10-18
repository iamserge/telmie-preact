import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card';
import PhotoCardsCol from './photo-card/photo-cards-col.js'

class PhotoCards extends Component{

	componentWillMount(){
		this.randomArr = [];

		for (let i = 0; i < 4; i++){
			this.randomArr = [...this.randomArr, Math.floor(Math.random() * 440 - 220)]
		}
	}

	renderCards = (cards) => (
		cards.map((card, index) => (
			Array.isArray(card) ? 
				<PhotoCardsCol cards={card}/> 
				: <PhotoCard key={card.id} {...card} cardStyle={{marginTop: this.randomArr[index]}}/>
		))
	)

	render(){
		const {cards = {}, styles = {}} = this.props;
		const {side1 = [], side2 =[]} = cards;

		return (
			<div class={style.photoCardsContainer}
				style={styles}>
				{ this.renderCards(side1) }
				<div class={style.videoWrapper}>
					<div class={style.videoContainer}>
						<video class={style.video} autoPlay loop muted>
							<source src="http://sr461.2dayhost.com/IMG_3531.TRIM.MOV" type="video/mp4"/>
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
				{ this.renderCards(side2) }
			</div>
		)
	}
}

export default PhotoCards;