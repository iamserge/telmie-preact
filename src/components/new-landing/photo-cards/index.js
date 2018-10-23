import { h, Component } from 'preact';
import style from './style.scss';
import PhotoCard from './photo-card';
import PhotoCardsCol from './photo-card/photo-cards-col'

class PhotoCards extends Component{

	componentWillMount(){
		this.randomArr = [0, 129, 78, 0];

		/*for (let i = 0; i < 4; i++){
			this.randomArr = [...this.randomArr, Math.floor(Math.random() * 440 - 220)]
		}*/
	}

	renderCards = (cards, startIndex = 0) => (
		cards.map((card, index) => (
			Array.isArray(card) ? 
				<PhotoCardsCol cards={card} cardStyle={{marginTop: this.randomArr[index + startIndex]}}/> 
				: <PhotoCard key={card.id} {...card} cardStyle={{marginTop: this.randomArr[index + startIndex]}}/>
		))
	)

	render(){
		const {cards = {}, styles = {}} = this.props;
		const {side1 = [], side2 =[]} = cards;

		return (
			<div class={`${style.photoCardsContainer} uk-container-big`}
				style={styles}>
				{ this.renderCards(side1) }
				<div class={style.videoWrapper}>
					<div class={style.videoContainer}>
						<video class={style.video} autoPlay loop muted>
							{/*<source src="http://sr461.2dayhost.com/IMG_3531.TRIM.MOV" type="video/mp4"/>*/}
							<source src='http://appdoc.by/media/IMG_3531.TRIM.MOV' type="video/mp4"/>
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
				{ this.renderCards(side2, 2) }
			</div>
		)
	}
}

export default PhotoCards;